import { QrCode } from "lucide-react";

export function DownloadApp() {
    return (
        <section className="py-12 lg:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 sm:p-10 lg:p-14 flex flex-col lg:flex-row items-center justify-between gap-8 h-full overflow-hidden relative shadow-2xl">
                {/* Background Decorative Circles */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>

                <div className="lg:w-[55%] flex flex-col justify-center relative z-10 text-center lg:text-left">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
                        Find Properties Faster on Our App
                    </h2>
                    <p className="text-blue-100/90 text-sm sm:text-base lg:text-lg mb-8 max-w-xl mx-auto lg:mx-0">
                        Get instant alerts & exclusive listings directly to your device. Scan the QR code or click the links below to download.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
                        {/* App Store Button */}
                        <button className="flex items-center justify-center gap-3 bg-white text-gray-900 px-5 sm:px-6 py-3 rounded-xl w-full sm:w-auto hover:bg-gray-50 hover:-translate-y-1 active:scale-95 transition-all duration-300 shadow-lg group">
                            <svg className="w-6 h-6 sm:w-7 sm:h-7" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M16.365 21.444c-1.39.957-2.73 1.055-4.008.06-1.127-.853-2.316-1.023-3.665.043-1.42 1.096-2.5 1.053-3.633-.217-3.793-4.102-5.914-10.428-2.67-14.887 1.517-2.072 3.682-3.13 5.48-3.13 1.942 0 3.322.84 4.545.84 1.25 0 2.21-.832 4.414-.832 2.126 0 3.86 1.033 4.965 2.502-3.96 2.115-3.328 7.6.93 9.42-1.07 2.434-2.825 4.506-4.996 6.075-.41.3-.878.58-1.362.126M15.115 1.272c-1.163.023-2.583.743-3.415 1.637-.77.82-1.424 2.155-1.246 3.44.02.13.045.263.076.398 1.488.223 2.72-.445 3.51-1.36.756-.88 1.343-2.296 1.075-4.115" />
                            </svg>
                            <div className="text-left">
                                <div className="text-[10px] sm:text-[11px] leading-none text-gray-500 mb-1 group-hover:text-gray-600 transition-colors">Download on the</div>
                                <div className="text-sm sm:text-base font-semibold leading-none">App Store</div>
                            </div>
                        </button>

                        {/* Play Store Button */}
                        <button className="flex items-center justify-center gap-3 bg-white text-gray-900 px-5 sm:px-6 py-3 rounded-xl w-full sm:w-auto hover:bg-gray-50 hover:-translate-y-1 active:scale-95 transition-all duration-300 shadow-lg group">
                            <svg className="w-6 h-6 sm:w-7 sm:h-7" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M3.609 1.814L13.792 12l-10.183 10.186c-.161-.258-.259-.575-.259-.926V2.74c0-.351.098-.668.259-.926zm1.18.252l8.28 8.281 2.37-2.372L5.808 2.308c-.368-.21-.718-.28-1.019-.242zm9.106 9.112l2.671 2.673-2.671 2.673L8.604 12l5.291-5.291zm1.134 6.438l-7.288 4.208c.301.037.651-.033 1.019-.242l9.636-5.568-3.367-3.367zM18.665 14.881l3.351-1.936c.642-.37.642-.977 0-1.348l-3.351-1.936-2.586 2.587 2.586 2.586z" />
                            </svg>
                            <div className="text-left">
                                <div className="text-[10px] sm:text-[11px] leading-none text-gray-500 mb-1 group-hover:text-gray-600 transition-colors">GET IT ON</div>
                                <div className="text-sm sm:text-base font-semibold leading-none">Google Play</div>
                            </div>
                        </button>
                    </div>
                </div>

                {/* QR Code Segment */}
                <div className="lg:w-[45%] flex items-center justify-center lg:justify-end relative z-10 w-full mt-4 lg:mt-0">
                    <div className="bg-white/10 backdrop-blur-md p-4 sm:p-6 rounded-3xl flex items-center gap-4 sm:gap-6 border border-white/20 hover:bg-white/15 transition-colors duration-300 shadow-xl w-full sm:w-auto justify-center">
                        <div className="bg-white p-3 sm:p-4 rounded-2xl w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center shadow-lg transform transition-transform duration-500 hover:rotate-3">
                            <QrCode className="w-full h-full text-indigo-900" strokeWidth={1.5} />
                        </div>
                        <div className="text-white text-left hidden sm:block">
                            <h3 className="font-semibold text-lg mb-1 leading-tight">Scan to<br />Download</h3>
                            <p className="text-blue-200/90 text-sm max-w-[120px] leading-snug tracking-wide">iOS & Android supported</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
