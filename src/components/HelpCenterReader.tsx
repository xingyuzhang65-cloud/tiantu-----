import React, { useMemo, useState } from 'react';
import { BookOpen, ChevronDown, Download, FileText, Search, Users } from 'lucide-react';

type Doc = {
  id: string;
  department: string;
  title: string;
  updateTime: string;
  customerVisible: boolean;
  summary: string;
  sections: string[];
  fileType: string;
};

const docs: Doc[] = [
  { id: 'd1', department: '业务部', title: '安速客户跟单操作手册', updateTime: '2026-06-01 18:10:11', customerVisible: true, summary: '客户下单、预报、轨迹跟进到签收的标准流程。', sections: ['适用范围', '操作步骤', '异常处理'], fileType: 'PDF' },
  { id: 'd2', department: '业务部', title: '运单异常跟进规范', updateTime: '2026-05-28 14:30:00', customerVisible: false, summary: '异常运单的识别、分派、处理和复盘。', sections: ['异常识别', '处理步骤', '复盘记录'], fileType: 'PDF' },
  { id: 'd3', department: '财务部', title: '来款登记核销指南', updateTime: '2026-05-25 09:15:00', customerVisible: false, summary: '来款登记、余额核销和异常账款处理。', sections: ['来款登记', '核销规则', '注意事项'], fileType: 'Word' },
  { id: 'd4', department: '系统配置部', title: '角色权限配置说明', updateTime: '2026-06-01 16:45:30', customerVisible: false, summary: '角色字典、权限分配与可见范围配置。', sections: ['角色字典', '权限分配', '发布检查'], fileType: 'HTML' },
  { id: 'd5', department: '数据分析部', title: '经营报表查看指南', updateTime: '2026-05-20 11:22:00', customerVisible: false, summary: '报表口径、筛选方式和导出策略。', sections: ['数据口径', '筛选条件', '导出说明'], fileType: 'Excel' },
];

function downloadDoc(doc: Doc) {
  const blob = new Blob([`${doc.title}\n\n${doc.summary}\n\n目录:\n${doc.sections.map((item) => `- ${item}`).join('\n')}`], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${doc.title}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function HelpCenterReader() {
  const [mode, setMode] = useState<'管理端' | '客户端'>('管理端');
  const [query, setQuery] = useState('');
  const [activeDept, setActiveDept] = useState('全部');
  const visibleDocs = useMemo(() => {
    const base = mode === '客户端' ? docs.filter((doc) => doc.customerVisible) : docs;
    return base
      .filter((doc) => (activeDept === '全部' ? true : doc.department === activeDept))
      .filter((doc) => !query || doc.title.includes(query) || doc.summary.includes(query))
      .sort((a, b) => b.updateTime.localeCompare(a.updateTime));
  }, [mode, query, activeDept]);
  const departments = ['全部', ...Array.from(new Set(docs.map((doc) => doc.department)))];
  const activeDoc = visibleDocs[0] || docs[0];

  return (
    <div className="flex h-full min-h-0 flex-col bg-slate-100">
      <div className="border-b border-slate-200 bg-white px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-slate-900">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <h1 className="text-lg font-bold">帮助中心</h1>
              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-600">文档阅读</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">按更新时间倒序展示，客户端仅显示可见文档</p>
          </div>
          <div className="flex items-center gap-2">
            {(['管理端', '客户端'] as const).map((item) => (
              <button key={item} onClick={() => setMode(item)} className={`rounded-md px-3 py-2 text-xs font-semibold ${mode === item ? 'bg-blue-600 text-white' : 'border border-slate-200 bg-white text-slate-600'}`}>
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto_auto]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索文档标题或摘要" className="h-10 w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-blue-400" />
          </label>
          <label className="block">
            <select value={activeDept} onChange={(e) => setActiveDept(e.target.value)} className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700">
              {departments.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Users className="h-4 w-4 text-slate-400" />
            共 {visibleDocs.length} 篇
          </div>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 gap-4 p-4 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-4 py-3 text-sm font-semibold text-slate-800">文档目录</div>
          <div className="max-h-full overflow-y-auto p-2">
            {mode === '管理端' ? departments.filter((item) => item !== '全部').map((dept) => {
              const items = visibleDocs.filter((doc) => doc.department === dept);
              return (
                <div key={dept} className="mb-2 rounded-lg border border-slate-200">
                  <div className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-700">
                    <span>{dept}</span>
                    <ChevronDown className="h-3 w-3 text-slate-400" />
                  </div>
                  <div className="border-t border-slate-100">
                    {items.length ? items.map((doc) => (
                      <button key={doc.id} onClick={() => document.getElementById(doc.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="flex w-full items-center gap-2 border-t border-slate-100 px-3 py-2 text-left text-xs text-slate-600 hover:bg-slate-50">
                        <FileText className="h-3.5 w-3.5 text-blue-500" />
                        <span className="truncate">{doc.title}</span>
                      </button>
                    )) : <div className="px-3 py-2 text-xs text-slate-400">暂无文档</div>}
                  </div>
                </div>
              );
            }) : (
              <div className="space-y-1 p-2">
                {visibleDocs.map((doc) => (
                  <button key={doc.id} onClick={() => document.getElementById(doc.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-slate-600 hover:bg-slate-50">
                    <FileText className="h-3.5 w-3.5 text-blue-500" />
                    <span className="truncate">{doc.title}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </aside>

        <main className="space-y-3 overflow-y-auto rounded-xl border border-slate-200 bg-white p-4">
          {visibleDocs.map((doc) => (
            <article key={doc.id} id={doc.id} className="rounded-lg border border-slate-200 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-semibold text-slate-900">{doc.title}</h2>
                    {doc.customerVisible && <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] text-emerald-700">客户可见</span>}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">{doc.department} · 更新于 {doc.updateTime} · {doc.fileType}</div>
                </div>
                <button onClick={() => downloadDoc(doc)} className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50">
                  <Download className="h-3.5 w-3.5" />
                  下载
                </button>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{doc.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {doc.sections.map((section) => (
                  <a key={section} href={`#${doc.id}-${section}`} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 hover:bg-slate-200">{section}</a>
                ))}
              </div>
              <div className="mt-4 grid gap-2 md:grid-cols-3">
                {doc.sections.map((section) => (
                  <div key={section} id={`${doc.id}-${section}`} className="rounded-md bg-slate-50 px-3 py-2 text-xs text-slate-600">
                    <div className="font-semibold text-slate-700">{section}</div>
                    <div className="mt-1">这里展示该章节的内容摘要，用于阅读预览。</div>
                  </div>
                ))}
              </div>
            </article>
          ))}
          {!visibleDocs.length && <div className="py-12 text-center text-sm text-slate-400">没有匹配的文档</div>}
        </main>
      </div>
    </div>
  );
}
