import React, { useState, useRef, useEffect } from 'react';
import Barcode from 'react-barcode';
import { Printer, Copy, Settings, Type, MessageCircle, Shuffle, Phone } from 'lucide-react';

/**
 * CUSTOM COMPONENT: FitText
 * Automatically scales text to fit its container without overflowing.
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
    <div ref={containerRef} className={`w-full h-full flex items-center ${className}`}>
      <div ref={textRef} style={{ transformOrigin: 'left center', whiteSpace: 'nowrap' }}>
        {children}
      </div>
    </div>
  );
};

const BarcodePrinter = () => {
  // Label Size: 50mm x 25mm
  const [settings] = useState({ widthMm: 50, heightMm: 25 });

  const [data, setData] = useState({
    storeName: 'SUPER MART',
    storePhone: '9876543210',
    productName: 'Jeera Rice Premium (1kg)',
    mrp: 140,
    price: 125,
    sku: '8901234567890',
  });

  const [printCount, setPrintCount] = useState(1);

  // --- Dummy Data ---
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
    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700;900&family=Oswald:wght@500;700&display=swap');
    
    .font-oswald { font-family: 'Oswald', sans-serif; }

    .preview-container {
      width: ${settings.widthMm}mm;
      height: ${settings.heightMm}mm;
      background: white;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    @media print {
      @page { size: ${settings.widthMm}mm ${settings.heightMm}mm; margin: 0; }
      html, body { margin: 0 !important; padding: 0 !important; background: white; }
      body * { visibility: hidden; }
      .print-area, .print-area * { visibility: visible; }
      .print-area { position: absolute; top: 0; left: 0; }
      .label-page {
        width: ${settings.widthMm}mm;
        height: ${settings.heightMm}mm;
        page-break-after: always;
        overflow: hidden;
        background: white;
        color: black;
      }
      .no-print { display: none !important; }
    }
  `;

  // === DESIGN: Minimalist Smart Layout ===
  const SingleLabel = ({ isPreview = false }) => (
    <div className={`
      ${isPreview ? 'preview-container' : 'label-page'} 
      flex flex-col p-[2mm] box-border relative
    `}>
      
      {/* 1. TOP ROW: Store Left | Phone Right (Height: 12%) */}
      <div className="flex justify-between items-baseline w-full h-[12%] border-b border-gray-300 pb-[1px]">
        <span className="font-bold text-[8px] uppercase tracking-wide leading-none">{data.storeName}</span>
        {data.storePhone && (
          <span className="text-[7px] font-semibold text-gray-800 leading-none tracking-tight">
            {data.storePhone}
          </span>
        )}
      </div>

      {/* 2. PRODUCT NAME (Height: 18%) */}
      <div className="w-full h-[18%] mt-[1px]">
        <FitText textStr={data.productName} maxScale={1.1}>
           <span className="font-black text-[11px] uppercase leading-none font-oswald">{data.productName}</span>
        </FitText>
      </div>

      {/* 3. BARCODE (Height: 48% - Increased Space) */}
      <div className="h-[48%] w-full flex items-center justify-center overflow-hidden">
         <div className="w-full h-full flex items-center justify-center">
           <Barcode 
             value={data.sku}
             width={1.3}         
             height={18}         /* Reduced bar height to make room for numbers */
             fontSize={10}       /* Readable numbers */
             fontOptions="bold"
             marginTop={0}       /* Critical: Removes top whitespace */
             marginBottom={0}    /* Critical: Removes bottom whitespace */
             displayValue={true}
             background="transparent"
             lineColor="#000"
             textMargin={1}      /* Gap between bars and numbers */
           />
         </div>
      </div>

      {/* 4. BOTTOM ROW: MRP | PRICE (Height: 22%) */}
      <div className="w-full h-[22%] flex items-end justify-between mt-[1px] border-t border-gray-300 pt-[1px]">
        <div className="flex flex-col leading-none">
          <span className="text-[6px] font-bold text-gray-500 uppercase">MRP</span>
          <span className="text-[9px] font-bold text-gray-400 line-through decoration-[1px] decoration-gray-800">
            {data.mrp}
          </span>
        </div>
        
        <div className="flex items-baseline gap-[1px] leading-none">
          <span className="text-[9px] font-bold mr-[1px]">₹</span>
          <span className="text-[18px] font-black font-oswald tracking-tight leading-[0.85]">
            {data.price}
          </span>
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
          Smart Label Printer
        </h2>
        <p className="text-sm text-slate-500 mt-1">50mm x 25mm (Fixed Layout)</p>
      </div>

      {/* PREVIEW */}
      <div className="no-print flex flex-col items-center gap-4 mb-8">
         <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Preview</div>
         <div className="border border-gray-300 shadow-xl bg-white">
            <SingleLabel isPreview={true} />
         </div>
         <div className="text-xs text-slate-400">
           Numbers under barcode should now be fully visible
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
            
            {/* INPUTS */}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2 border-b pb-2">
                 <div className="flex items-center gap-2">
                    <Type size={18} className="text-slate-400" />
                    <span className="font-bold text-sm text-slate-600">Details</span>
                 </div>
                 <button 
                   onClick={handleRandomProduct}
                   className="text-xs flex items-center gap-1 bg-slate-100 hover:bg-blue-100 text-slate-600 hover:text-blue-600 px-2 py-1 rounded transition-colors"
                 >
                   <Shuffle size={12} /> Random
                 </button>
              </div>
              
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">Product Name</label>
                <input 
                  type="text" value={data.productName}
                  onChange={(e) => setData({...data, productName: e.target.value})}
                  className="w-full border rounded p-2 text-sm font-semibold"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">Barcode</label>
                <input 
                  type="text" value={data.sku}
                  onChange={(e) => setData({...data, sku: e.target.value})}
                  className="w-full border rounded p-2 text-sm font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase">MRP</label>
                    <input 
                      type="number" value={data.mrp}
                      onChange={(e) => setData({...data, mrp: e.target.value})}
                      className="w-full border rounded p-2 text-sm"
                    />
                 </div>
                 <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Sell Price</label>
                    <input 
                      type="number" value={data.price}
                      onChange={(e) => setData({...data, price: e.target.value})}
                      className="w-full border-2 border-slate-800 rounded p-2 text-sm font-bold"
                    />
                 </div>
              </div>
            </div>

            {/* SETTINGS */}
            <div className="space-y-4 flex flex-col h-full">
               <div className="flex items-center gap-2 mb-2 border-b pb-2">
                 <Settings size={18} className="text-slate-400" />
                 <span className="font-bold text-sm text-slate-600">Store</span>
               </div>

               <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Store Name</label>
                  <input 
                    type="text" value={data.storeName}
                    onChange={(e) => setData({...data, storeName: e.target.value})}
                    className="w-full border rounded p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Phone</label>
                  <input 
                    type="text" value={data.storePhone}
                    onChange={(e) => setData({...data, storePhone: e.target.value})}
                    className="w-full border rounded p-2 text-sm"
                  />
                </div>
               </div>

               <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mt-auto">
                 <div className="flex items-center justify-between mb-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                      <Copy size={12} /> Copies
                    </label>
                    <span className="text-xl font-black text-slate-700">{printCount}</span>
                 </div>
                 <input 
                    type="range" min="1" max="50" value={printCount}
                    onChange={(e) => setPrintCount(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                 />
               </div>

               <button 
                 onClick={() => window.print()}
                 className="w-full bg-black text-white py-3 rounded-lg font-bold shadow-lg flex items-center justify-center gap-2 hover:bg-slate-800 transition"
               >
                 <Printer size={20} /> PRINT
               </button>

               <div className="pt-2 border-t border-slate-100 text-center">
                  <a href="https://wa.me/919309555464" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-green-600 hover:underline text-[10px] font-bold uppercase"
                  >
                    <MessageCircle size={12} /> Support: 9309555464
                  </a>
               </div>
            </div>

         </div>
      </div>
    </div>
  );
};

export default BarcodePrinter;
