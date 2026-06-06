export default function Modal({ children }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-950 p-5 shadow-2xl shadow-black/40">
        {children}
      </div>
    </div>
  );
}
