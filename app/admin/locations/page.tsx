"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { State, City, Locality, getStates, getCitiesByState, getLocalitiesByCity, clearLocationsCache } from "@/lib/api/locations";
import { Trash2, Plus, AlertCircle, Loader2, Search, Edit2, X } from "lucide-react";

export default function AdminLocationsPage() {
    const supabase = createClient();
    const [states, setStates] = useState<State[]>([]);
    const [selectedState, setSelectedState] = useState<string>("");

    const [cities, setCities] = useState<City[]>([]);
    const [selectedCity, setSelectedCity] = useState<string>("");

    const [localities, setLocalities] = useState<Locality[]>([]);
    const [localitySearch, setLocalitySearch] = useState<string>("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Form states
    const [newCityName, setNewCityName] = useState("");
    const [newLocalityName, setNewLocalityName] = useState("");
    const [newLocalityPincode, setNewLocalityPincode] = useState("");
    const [editingLocality, setEditingLocality] = useState<Locality | null>(null);

    useEffect(() => {
        loadStates();
    }, []);

    useEffect(() => {
        if (selectedState) loadCities(selectedState);
        else setCities([]);
        setSelectedCity("");
    }, [selectedState]);

    useEffect(() => {
        if (selectedCity) loadLocalities(selectedCity);
        else setLocalities([]);
        setLocalitySearch("");
        setEditingLocality(null);
        setNewLocalityName("");
        setNewLocalityPincode("");
    }, [selectedCity]);

    // Smart detection: switch to edit mode if pincode already exists
    useEffect(() => {
        const trimmedPincode = newLocalityPincode.trim();
        if (trimmedPincode.length >= 4) {
            const existingLoc = localities.find(l => l.pincode === trimmedPincode);
            if (existingLoc && (!editingLocality || editingLocality.id !== existingLoc.id)) {
                setEditingLocality(existingLoc);
                // Only overwrite the name if they haven't typed one yet
                if (!newLocalityName.trim()) {
                    setNewLocalityName(existingLoc.name);
                }
            }
        }
    }, [newLocalityPincode, localities, editingLocality, newLocalityName]);

    const loadStates = async () => {
        setLoading(true);
        try {
            const data = await getStates();
            setStates(data);
            if (data.length > 0) setSelectedState(data[0].id);
        } catch {
            setError("Failed to load states.");
        } finally {
            setLoading(false);
        }
    };

    const loadCities = async (stateId: string) => {
        try {
            const data = await getCitiesByState(stateId);
            setCities(data);
        } catch (err) {
            console.error(err);
        }
    };

    const loadLocalities = async (cityId: string) => {
        try {
            const data = await getLocalitiesByCity(cityId);
            setLocalities(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddCity = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCityName.trim() || !selectedState) return;

        try {
            const { error: dbError } = await supabase
                .from("cities")
                .insert({ state_id: selectedState, name: newCityName.trim() });

            if (dbError) throw dbError;

            setNewCityName("");

            setNewCityName("");

            // clear cache for this state and reload
            clearLocationsCache('cities', selectedState);
            loadCities(selectedState);
        } catch (err: any) {
            console.error("Add city error:", err);
            const message = err?.message || "Failed to add city";
            alert(`Error: ${message}`);
        }
    };

    const handleDeleteCity = async (id: string) => {
        if (!confirm("Are you sure you want to delete this city and all its localities? This action cannot be undone and may affect associated properties.")) return;
        try {
            const { error: dbError } = await supabase.from("cities").delete().eq("id", id);
            if (dbError) throw dbError;
            clearLocationsCache('cities', selectedState);
            loadCities(selectedState);
        } catch (err: any) {
            console.error("Delete city error:", err);
            const message = err?.message || "Failed to delete city";
            alert(`Error: ${message}`);
        }
    };

    const handleEditLocality = (loc: Locality) => {
        setEditingLocality(loc);
        setNewLocalityName(loc.name);
        setNewLocalityPincode(loc.pincode);
    };

    const handleCancelEdit = () => {
        setEditingLocality(null);
        setNewLocalityName("");
        setNewLocalityPincode("");
    };

    const handleSaveLocality = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newLocalityName.trim() || !newLocalityPincode.trim() || !selectedCity) return;

        try {
            if (editingLocality) {
                // Update the locality — the DB trigger will automatically sync properties
                const { error: dbError } = await supabase
                    .from("localities")
                    .update({
                        name: newLocalityName.trim(),
                        pincode: newLocalityPincode.trim()
                    })
                    .eq("id", editingLocality.id);

                if (dbError) throw dbError;

                // Check how many properties were synced
                const { count } = await supabase
                    .from("properties")
                    .select("id", { count: "exact", head: true })
                    .eq("locality_id", editingLocality.id);

                const syncedCount = count ?? 0;
                if (syncedCount > 0) {
                    alert(`✅ Locality updated! ${syncedCount} linked propert${syncedCount === 1 ? 'y was' : 'ies were'} automatically synced.`);
                }

                setEditingLocality(null);
            } else {
                // Insert
                const { error: dbError } = await supabase
                    .from("localities")
                    .insert({
                        city_id: selectedCity,
                        name: newLocalityName.trim(),
                        pincode: newLocalityPincode.trim()
                    });

                if (dbError) throw dbError;
            }

            setNewLocalityName("");
            setNewLocalityPincode("");
            clearLocationsCache('localities', selectedCity);
            loadLocalities(selectedCity);
        } catch (err: any) {
            console.error("Save locality error:", err);
            let message = err?.message || "Failed to save locality";
            alert(`Error: ${message}`);
        }
    };

    const handleDeleteLocality = async (id: string) => {
        if (!confirm("Are you sure you want to delete this locality? This action cannot be undone and may affect associated properties.")) return;
        try {
            const { error: dbError } = await supabase.from("localities").delete().eq("id", id);
            if (dbError) throw dbError;
            clearLocationsCache('localities', selectedCity);
            loadLocalities(selectedCity);
        } catch (err: any) {
            console.error("Delete locality error:", err);
            let message = err?.message || "Failed to delete locality";
            if (err?.code === '23503') {
                message = "Cannot delete this locality because it is currently linked to one or more properties. Please reassign or delete those properties first.";
            }
            alert(`Error: ${message}`);
        }
    };

    if (loading) return (
        <div className="p-8 flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
    );

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto w-full">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-text-primary">Location Management</h1>
                <p className="text-text-secondary mt-1">Manage states, cities, and localities across the platform.</p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 mb-6">
                    <AlertCircle className="w-5 h-5" />
                    <p>{error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* States (Read-only for now based on config) */}
                <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
                    <h2 className="font-semibold text-lg text-text-primary mb-4">Allowed States</h2>
                    <div className="space-y-2">
                        {states.map(state => (
                            <button
                                key={state.id}
                                onClick={() => setSelectedState(state.id)}
                                className={`w-full text-left px-4 py-3 rounded-xl border transition-colors ${selectedState === state.id
                                    ? 'bg-primary/5 border-primary text-primary font-medium'
                                    : 'border-border text-text-secondary hover:bg-slate-50'
                                    }`}
                            >
                                {state.name}
                            </button>
                        ))}
                    </div>
                    <p className="text-xs text-text-muted mt-4">States are globally configured and read-only.</p>
                </div>

                {/* Cities */}
                <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
                    <h2 className="font-semibold text-lg text-text-primary mb-4 flex justify-between items-center">
                        Cities
                        {selectedState && <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-md">{cities.length} items</span>}
                    </h2>

                    {!selectedState ? (
                        <p className="text-text-muted text-sm text-center py-8">Select a state first</p>
                    ) : (
                        <>
                            <form onSubmit={handleAddCity} className="flex gap-2 mb-4">
                                <input
                                    type="text"
                                    placeholder="New City Name"
                                    value={newCityName}
                                    onChange={e => setNewCityName(e.target.value)}
                                    className="flex-1 px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                                <button type="submit" disabled={!newCityName.trim()} className="p-2 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:opacity-50">
                                    <Plus className="w-5 h-5" />
                                </button>
                            </form>

                            <div className="space-y-2 max-h-[400px] overflow-y-auto">
                                {cities.length === 0 && <p className="text-sm text-text-muted italic">No cities found.</p>}
                                {cities.map(city => (
                                    <div key={city.id} className="flex items-center gap-2">
                                        <button
                                            onClick={() => setSelectedCity(city.id)}
                                            className={`flex-1 text-left px-4 py-2.5 rounded-xl border transition-colors text-sm ${selectedCity === city.id
                                                ? 'bg-primary/5 border-primary text-primary font-medium'
                                                : 'border-border text-text-secondary hover:bg-slate-50'
                                                }`}
                                        >
                                            {city.name}
                                        </button>
                                        <button onClick={() => handleDeleteCity(city.id)} className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Localities */}
                <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
                    <h2 className="font-semibold text-lg text-text-primary mb-4 flex justify-between items-center">
                        Localities
                        {selectedCity && <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-md">{localities.length} items</span>}
                    </h2>

                    {!selectedCity ? (
                        <p className="text-text-muted text-sm text-center py-8">Select a city first</p>
                    ) : (
                        <>
                            <form onSubmit={handleSaveLocality} className={`flex flex-col gap-2 mb-4 p-3 rounded-xl border transition-colors ${editingLocality ? 'bg-primary/5 border-primary/20' : 'border-transparent'}`}>
                                {editingLocality && (
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs font-semibold text-primary">Edit Locality</span>
                                        <button type="button" onClick={handleCancelEdit} className="text-xs text-slate-500 hover:text-slate-800 flex items-center">
                                            <X className="w-3 h-3 mr-0.5" /> Cancel
                                        </button>
                                    </div>
                                )}
                                <input
                                    type="text"
                                    placeholder="Locality Name"
                                    value={newLocalityName}
                                    onChange={e => setNewLocalityName(e.target.value)}
                                    className="px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary w-full"
                                />
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Pincode"
                                        value={newLocalityPincode}
                                        onChange={e => setNewLocalityPincode(e.target.value)}
                                        className="flex-1 px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary w-full"
                                    />
                                    <button type="submit" disabled={!newLocalityName.trim() || !newLocalityPincode.trim()} className="p-2 px-4 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:opacity-50 text-sm font-medium transition-colors">
                                        {editingLocality ? "Save" : "Add"}
                                    </button>
                                </div>
                            </form>

                            {(() => {
                                const filtered = localities.filter(loc => 
                                    loc.name.toLowerCase().includes(localitySearch.toLowerCase()) || 
                                    loc.pincode.includes(localitySearch)
                                );
                                return (
                                    <>
                                        <div className="relative mb-3">
                                            <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                                            <input
                                                type="text"
                                                placeholder="Search localities or pincode..."
                                                value={localitySearch}
                                                onChange={e => setLocalitySearch(e.target.value)}
                                                className="w-full pl-9 pr-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-slate-50/50"
                                            />
                                        </div>

                                        <div className="space-y-2 max-h-[400px] overflow-y-auto">
                                            {filtered.length === 0 && <p className="text-sm text-text-muted italic">No localities found.</p>}
                                            {filtered.map(loc => (
                                                <div key={loc.id} className="flex items-center justify-between px-4 py-2.5 rounded-xl border border-border bg-slate-50 gap-2">
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-sm font-medium text-text-primary truncate">{loc.name}</p>
                                                        <p className="text-xs text-text-muted font-mono">{loc.pincode}</p>
                                                    </div>
                                                    <div className="flex gap-1 flex-shrink-0">
                                                        <button onClick={() => handleEditLocality(loc)} className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                        <button onClick={() => handleDeleteLocality(loc.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                );
                            })()}
                        </>
                    )}
                </div>

            </div>
        </div>
    );
}
