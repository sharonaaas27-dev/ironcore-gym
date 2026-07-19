export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="hidden md:block absolute -left-1/4 -top-1/4 h-[500px] w-[500px] animate-blob1 rounded-full bg-gold-500/10 blur-[100px]" />
      <div className="hidden md:block absolute -right-1/4 top-1/3 h-[400px] w-[400px] animate-blob2 rounded-full bg-gold-400/5 blur-[100px]" />
      <div className="hidden md:block absolute -bottom-1/4 left-1/3 h-[600px] w-[600px] animate-blob3 rounded-full bg-gold-600/10 blur-[120px]" />
      <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-500/5 blur-[80px]" />
    </div>
  );
}
