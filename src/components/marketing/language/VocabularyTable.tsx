import AudioPlayer from './AudioPlayer';
import { VocabItem } from '@/data/language-course';

interface VocabularyTableProps {
  items: VocabItem[];
}

export default function VocabularyTable({ items }: VocabularyTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b-2 border-gray-200">
            <th className="px-6 py-4 text-left font-montserrat font-semibold text-gray-900 text-sm uppercase tracking-wide w-1/4">
              Chinese
            </th>
            <th className="px-6 py-4 text-left font-montserrat font-semibold text-gray-900 text-sm uppercase tracking-wide w-1/4">
              Pinyin
            </th>
            <th className="px-6 py-4 text-left font-montserrat font-semibold text-gray-900 text-sm uppercase tracking-wide w-1/3">
              English
            </th>
            <th className="px-6 py-4 text-center font-montserrat font-semibold text-gray-900 text-sm uppercase tracking-wide w-1/6">
              Audio
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr
              key={index}
              className="border-b border-gray-100 hover:bg-slate-50 transition-colors"
            >
              <td className="px-6 py-4 font-chinese text-2xl text-gray-900 font-medium">
                {item.hanzi}
              </td>
              <td className="px-6 py-4 text-gray-700 italic text-base">
                {item.pinyin}
              </td>
              <td className="px-6 py-4 text-gray-700 text-base">
                {item.english}
              </td>
              <td className="px-6 py-4 text-center">
                <AudioPlayer audioFile={item.audioFile} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
