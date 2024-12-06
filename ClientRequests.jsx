import React, { useState } from "'react'"
import { FileText, ChevronLeft, ChevronRight, Check, X, Filter, Search } from "'lucide-react'"
import { requests as mockRequests } from "'./requests'"

export default function ClientRequests() {
  const [requests] = useState(mockRequests)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 7

  const totalPages = Math.ceil(requests.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentRequests = requests.slice(startIndex, endIndex)

  return (
    (<div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-6xl rounded-lg bg-white p-6 shadow-sm">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-gray-900">New Request</h1>
          <p className="text-sm text-gray-500">Manage new client requests here.</p>
        </div>

        {/* Filters and Search */}
        <div
          className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <button
              className="flex items-center gap-2 rounded-md border border-slate-200 border-gray-200 bg-white px-3 py-2 text-sm dark:border-slate-800">
              <Filter className="h-4 w-4" />
              Filter By
            </button>
            
            <select
              className="rounded-md border border-slate-200 border-gray-200 bg-white px-3 py-2 text-sm dark:border-slate-800">
              <option>Date</option>
            </select>
            
            <select
              className="rounded-md border border-slate-200 border-gray-200 bg-white px-3 py-2 text-sm dark:border-slate-800">
              <option>Project Type</option>
            </select>
            
            <button className="text-sm text-red-500">Reset Filter</button>
          </div>
          
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="w-full rounded-md border border-slate-200 border-gray-200 py-2 pl-10 pr-4 text-sm focus:border-gray-300 focus:outline-none md:w-64 dark:border-slate-800" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] table-auto">
            <thead>
              <tr className="border-b text-left text-sm text-gray-500">
                <th className="pb-3 font-medium">ID</th>
                <th className="pb-3 font-medium">CLIENT NAME</th>
                <th className="pb-3 font-medium">PROJECT TYPE</th>
                <th className="pb-3 font-medium">PROJECT DOC</th>
                <th className="pb-3 font-medium">START DATE</th>
                <th className="pb-3 font-medium">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {currentRequests.map((request) => (
                <tr key={request.id} className="border-b text-sm">
                  <td className="py-4">{request.id}</td>
                  <td className="py-4">{request.clientName}</td>
                  <td className="py-4">{request.projectType}</td>
                  <td className="py-4">
                    <FileText className="h-5 w-5 text-blue-500" />
                  </td>
                  <td className="py-4">{request.startDate}</td>
                  <td className="py-4">
                    <div className="flex gap-2">
                      <button className="rounded-full p-1 text-green-500 hover:bg-green-50">
                        <Check className="h-4 w-4" />
                      </button>
                      <button className="rounded-full p-1 text-red-500 hover:bg-red-50">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <span>Showing {startIndex + 1}-{Math.min(endIndex, requests.length)} of {requests.length}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="rounded p-1 hover:bg-gray-100 disabled:opacity-50">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="rounded p-1 hover:bg-gray-100 disabled:opacity-50">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>)
  );
}

