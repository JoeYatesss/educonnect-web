import Link from 'next/link';

export default function AuthHeader() {
  return (
    <div className="flex flex-col items-center mb-8">
      <Link href="/" className="flex items-center gap-2">
        <span className="text-gray-900 font-montserrat text-3xl font-bold tracking-tight">
          EduConnect
        </span>
        <span
          className="text-brand-red font-chinese text-[2.25rem] font-bold"
          style={{textShadow: '1px 1px 3px rgba(230, 74, 74, 0.3)'}}
        >
          中国
        </span>
      </Link>
    </div>
  );
}
