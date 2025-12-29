import React, { useState, useRef, useEffect } from 'react';
import Barcode from 'react-barcode';
import { Printer, Copy, Settings, Type, MessageCircle, Shuffle, Phone } from 'lucide-react';

/**
 * CUSTOM COMPONENT: FitText
 * Automatically scales text to fit its container.
 */
const FitText = ({ children, className = "", maxScale = 1.5, textStr = "" }) => {
  const containerRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const text = textRef.current;
    if (!container || !text) return;

    const resize = () => {
      text.style.transform = 'scale(1)';
      const containerWidth = container.offsetWidth;
      const containerHeight = container.offsetHeight;
      const textWidth = text.scrollWidth;
      const textHeight = text.scrollHeight;

      if (textWidth === 0 || textHeight === 0) return;

      const scaleX = containerWidth / textWidth;
      const scaleY = containerHeight / textHeight;
      const scale = Math.min(scaleX, scaleY, maxScale);

      text.style.transform = `scale(${scale})`;
    };

    resize();
  }, [children, maxScale, textStr]);

  return (
    <div ref={containerRef} className={`w-full h-full flex items-center justify-center overflow-hidden ${className}`}>
      <div ref={textRef} style={{ transformOrigin: 'center center', whiteSpace: 'nowrap' }}>
        {children}
      </div>
    </div>
  );
};

const BarcodePrinter = () => {
  // Standard TSC TTP 244 Label Size: 50mm x 25mm
  const [settings] = useState({
    widthMm: 50,
    heightMm: 25,
  });

  const [data, setData] = useState({
    storeName: 'SUPER MART',
    storePhone: '9876543210', // Default store contact
    productName: 'Jeera Rice Premium (1kg)',
    mrp: 140,
    price: 125,
    sku: '8901234567890',
  });

  const [printCount, setPrintCount] = useState(1);

  // --- Dummy Data Generator ---
  const dummyProducts = [
    { name: 'Maggi Noodles 140g', mrp: 14, price: 12, sku: '8901058000456' },
    { name: 'Lux Soap Bar 100g', mrp: 35, price: 32, sku: '8901030824089' },
    { name: 'Tata Salt 1kg Pack', mrp: 28, price: 25, sku: '8904043901019' },
    { name: 'Amul Butter 100g', mrp: 58, price: 55, sku: '8901262010025' },
    { name: 'Coca Cola 750ml', mrp: 40, price: 38, sku: '5449000000996' },
    { name: 'Surf Excel Easy Wash', mrp: 110, price: 99, sku: '8901030542150' },
  ];

  const handleRandomProduct = () => {
    const randomItem = dummyProducts[Math.floor(Math.random() * dummyProducts.length)];
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const newSku = randomItem.sku.substring(0, 10) + randomSuffix;

    setData(prev => ({
      ...prev,
      productName: randomItem.name,
      mrp: randomItem.mrp,
      price: randomItem.price,
      sku: newSku
    }));
  };

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700;900&family=Inconsolata:wght@700&display=swap');
    
    .font-mono-num { font-family: 'Inconsolata', monospace; }

    /* Screen Preview Styles */
    .preview-container {
      width: ${settings.widthMm}mm;
      height: ${settings.heightMm}mm;
      background: white;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }

    /* PRINT MEDIA QUERY */
    @media print {
      @page {
        size: ${settings.widthMm}mm ${settings.heightMm}mm;
        margin: 0;
      }
      html, body { 
        margin: 0 !important; 
        padding: 0 !important;
        background: white; 
      }
      body * { visibility: hidden; }
      .print-area, .print-area * { visibility: visible; }
      .print-area {
        position: absolute;
        top: 0;
        left: 0;
      }
      .label-page {
        width: ${settings.widthMm}mm;
        height: ${settings.heightMm}mm;
        page-break-after: always;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        background: white;
        color: black;
      }
      .no-print { display: none !important; }
    }
  `;

  const SingleLabel = ({ isPreview = false }) => (
    <div className={`
      ${isPreview ? 'preview-container' : 'label-page'} 
      relative flex flex-col items-center justify-between p-[1.5mm] box-border border-0
    `}>
      {/* 1. Header: Store Name & Phone */}
      <div className="w-full h-[18%] border-b border-black flex flex-col items-center justify-center leading-none pb-[1px]">
        <span className="font-bold text-[8px] uppercase tracking-wider">{data.storeName}</span>
        {data.storePhone && (
          <span className="text-[6px] font-bold mt-[1px]">Ph: {data.storePhone}</span>
        )}
      </div>

      {/* 2. Product Name */}
      <div className="w-full h-[18%] mt-[1px]">
        <FitText textStr={data.productName} maxScale={1}>
           <span className="font-bold uppercase text-[10px]">{data.productName}</span>
        </FitText>
      </div>

      {/* 3. Barcode Area - Tuned for human readability */}
      <div className="flex-1 w-full flex items-center justify-center overflow-hidden -mt-[1px]">
         <div className="w-full h-full flex items-center justify-center transform scale-y-105">
           <Barcode 
             value={data.sku}
             width={1.2}        
             height={25}        
             fontSize={9}        /* Increased font size for readability */
             fontOptions="bold"  /* Bold text for easier reading */
             margin={0}
             displayValue={true} /* Ensures number is printed */
             background="transparent"
             lineColor="#000000"
             textMargin={0}
           />
         </div>
      </div>

      {/* 4. Footer: Price Info */}
      <div className="w-full h-[24%] flex items-center justify-between border-t border-black pt-[1px]">
        <div className="flex flex-col items-start leading-none">
          <span className="text-[6px] font-bold text-gray-600">MRP</span>
          <span className="text-[10px] line-through font-mono-num decoration-[1px]">₹{data.mrp}</span>
        </div>
        
        <div className="flex flex-col items-end leading-none">
          <span className="text-[6px] font-bold">OUR PRICE</span>
          <span className="text-[14px] font-black font-mono-num">₹{data.price}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 font-sans flex flex-col items-center p-6 text-slate-800">
      <style>{styles}</style>

      {/* HEADER */}
      <div className="no-print mb-8 text-center">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
          <Printer size={28} className="text-slate-700" /> 
          TTP 244 Barcode Generator
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Optimized for 50mm x 25mm Thermal Labels
        </p>
      </div>

      {/* PREVIEW */}
      <div className="no-print flex flex-col items-center gap-4 mb-8">
         <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Live Preview</div>
         <div className="border border-slate-300 shadow-xl bg-white">
            <SingleLabel isPreview={true} />
         </div>
         <div className="text-xs text-slate-400">
           Check "Ph:" and barcode number visibility
         </div>
      </div>

      {/* HIDDEN PRINT AREA */}
      <div className="print-area hidden">
         {Array.from({ length: printCount }).map((_, index) => (
           <SingleLabel key={index} />
         ))}
      </div>

      {/* CONTROLS */}
      <div className="no-print w-full max-w-3xl bg-white rounded-xl shadow-sm border border-slate-200 p-6">
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left Column: Product Data */}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2 border-b pb-2">
                 <div className="flex items-center gap-2">
                    <Type size={18} className="text-slate-400" />
                    <span className="font-bold text-sm text-slate-600">Product Details</span>
                 </div>
                 <button 
                   onClick={handleRandomProduct}
                   className="text-xs flex items-center gap-1 bg-slate-100 hover:bg-blue-100 text-slate-600 hover:text-blue-600 px-2 py-1 rounded transition-colors"
                 >
                   <Shuffle size={12} /> Random
                 </button>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Product Name</label>
                <input 
                  type="text" 
                  value={data.productName}
                  onChange={(e) => setData({...data, productName: e.target.value})}
                  className="w-full border border-slate-300 rounded p-2 text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Barcode / SKU</label>
                <input 
                  type="text" 
                  value={data.sku}
                  onChange={(e) => setData({...data, sku: e.target.value})}
                  className="w-full border border-slate-300 rounded p-2 text-sm font-mono tracking-wide"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">MRP</label>
                    <input 
                      type="number" 
                      value={data.mrp}
                      onChange={(e) => setData({...data, mrp: e.target.value})}
                      className="w-full border border-slate-300 rounded p-2 text-sm"
                    />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Our Price</label>
                    <input 
                      type="number" 
                      value={data.price}
                      onChange={(e) => setData({...data, price: e.target.value})}
                      className="w-full border-2 border-slate-700 rounded p-2 text-sm font-bold"
                    />
                 </div>
              </div>
            </div>

            {/* Right Column: Settings */}
            <div className="space-y-4 flex flex-col h-full">
               <div className="flex items-center gap-2 mb-2 border-b pb-2">
                 <Settings size={18} className="text-slate-400" />
                 <span className="font-bold text-sm text-slate-600">Label Settings</span>
               </div>

               <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Store Name</label>
                <input 
                  type="text" 
                  value={data.storeName}
                  onChange={(e) => setData({...data, storeName: e.target.value})}
                  className="w-full border border-slate-300 rounded p-2 text-sm"
                />
               </div>

               {/* NEW: Store Phone Input */}
               <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
                    <Phone size={12} /> Store Phone
                </label>
                <input 
                  type="text" 
                  value={data.storePhone}
                  onChange={(e) => setData({...data, storePhone: e.target.value})}
                  placeholder="For label (e.g., 9876543210)"
                  className="w-full border border-slate-300 rounded p-2 text-sm"
                />
               </div>

               <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 mt-auto">
                 <label className="block text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-2">
                   <Copy size={14} /> Copies to Print
                 </label>
                 <div className="flex items-center gap-4">
                   <input 
                      type="range" 
                      min="1" 
                      max="50" 
                      value={printCount}
                      onChange={(e) => setPrintCount(Number(e.target.value))}
                      className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                   />
                   <span className="text-2xl font-black text-slate-700 w-12 text-center">{printCount}</span>
                 </div>
               </div>

               <div className="pt-2">
                 <button 
                   onClick={() => window.print()}
                   className="w-full bg-slate-900 hover:bg-black text-white py-3 rounded-lg font-bold shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"
                 >
                   <Printer size={20} /> PRINT LABELS
                 </button>
               </div>

               <div className="pt-4 mt-2 border-t border-slate-100">
                  <a 
                    href="https://wa.me/919309555464" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 text-green-600 hover:text-green-700 hover:bg-green-50 p-2 rounded-lg transition-colors group"
                  >
                    <MessageCircle size={18} />
                    <span className="text-xs font-bold uppercase tracking-wide">
                      Software Support: <span className="group-hover:underline">+91 9309555464</span>
                    </span>
                  </a>
               </div>
            </div>

         </div>
      </div>
    </div>
  );
};

export default BarcodePrinter;
