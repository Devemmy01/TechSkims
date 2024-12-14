import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FileText,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Filter,
  Search,
  Download,
  Edit as EditIcon,
  Eye,
  Image,
} from "lucide-react";
import { Link } from "react-router-dom";
import banner from "@/assets/banner.png";
import bannermob from "@/assets/bannermob.png";
import { Skeleton } from "@/components/ui/skeleton";

const BASE_URL = "https://beta.techskims.tech/api";

function Projects() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState("all");

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get(`${BASE_URL}/admin/requests`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.status === "success") {
          const transformedData = response.data.data.map((project) => ({
            id: project.id,
            service: project.service || project.projectType,
            startDate: project.startDate,
            endDate: project.completionDate || project.endDate,
            technicianTitle:
              project.technician?.name || project.technicianTitle,
            clientName: project.client?.name || project.client || 'N/A',
            status: project.status?.toLowerCase() || "pending",
          }));
          setRequests(transformedData);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const itemsPerPage = 5;

  const handleReset = () => {
    setStatus("all");
    setSearchTerm("");
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.service?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.technicianTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.id?.toString().includes(searchTerm);

    if (!matchesSearch) return false;

    if (status === "all") return true;
    return request.status?.toLowerCase() === status.toLowerCase();
  });

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRequests = filteredRequests.slice(startIndex, endIndex);

  const TableLoader = () => (
    <tbody>
      {[...Array(7)].map((_, index) => (
        <tr key={index} className="border-b">
          <td className="px-6 py-4">
            <Skeleton className="h-4 w-8" />
          </td>
          <td className="px-6 py-4">
            <Skeleton className="h-4 w-32" />
          </td>
          <td className="px-6 py-4">
            <Skeleton className="h-4 w-24" />
          </td>
          <td className="px-6 py-4">
            <Skeleton className="h-4 w-24" />
          </td>
          <td className="px-6 py-4">
            <Skeleton className="h-4 w-28" />
          </td>
          <td className="px-6 py-4">
            <Skeleton className="h-8 w-24 rounded-md" />
          </td>
        </tr>
      ))}
    </tbody>
  );

  return (
    <div className="bg-[#F8F8F8] w-full px-4 md:px-10 absolute lg:w-[calc(100%-256px)] pb-10">
      <div className="w-full flex items-center justify-between mt-10 pb-3">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-[600] text-[#202224]">Projects</h1>
          <p className="text-[#666666] text-sm text-[500] pb-3">
            Manage your projects
          </p>
        </div>

        <Link
          to="/admin/requests"
          className="bg-[#00a6e8] hover:bg-[#00a6e8]/80 transition-all duration-300 cursor-pointer rounded-[4px] h-[48px] w-fit flex items-center px-5 text-white whitespace-nowrap"
        >
          View Requests
        </Link>
      </div>

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-3 border rounded-[10px] p-1">
          <button className="flex items-center gap-2 text-black font-[700] rounded-md px-3 py-2 text-sm border-r">
            <Filter className="h-5 w-5" />
            Filter By
          </button>

          <select
            className="rounded-md border-r bg-transparent outline-none font-[700] px-3 py-2"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>

          <button
            className="font-[700] flex gap-4 text-[#EA0234]"
            onClick={handleReset}
          >
            <svg
              width="12"
              height="16"
              className="mt-[2px]"
              viewBox="0 0 12 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 3.75V0.75L2.25 4.5L6 8.25V5.25C8.4825 5.25 10.5 7.2675 10.5 9.75C10.5 12.2325 8.4825 14.25 6 14.25C3.5175 14.25 1.5 12.2325 1.5 9.75H0C0 13.065 2.685 15.75 6 15.75C9.315 15.75 12 13.065 12 9.75C12 6.435 9.315 3.75 6 3.75Z"
                fill="#EA0234"
              />
            </svg>
            Reset Filter
          </button>
        </div>

        <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full rounded-md border border-slate-200 py-2 pl-10 pr-4 text-sm focus:border-gray-300 focus:outline-none md:w-64"
                />
              </div>        
      </div>

      <div className="overflow-x-auto border shadow-sm rounded-t-[8px] bg-white">
        <table className="w-full min-w-[800px] table-auto whitespace-nowrap">
          <thead>
            <tr className="border-b text-sm text-black bg-gray-50">
              <th className="px-6 py-4 font-bold uppercase text-left w-16">ID</th>
              <th className="px-6 py-4 font-bold uppercase text-left">Project Type</th>
              <th className="px-6 py-4 font-bold uppercase text-left">Client Name</th>
              <th className="px-6 py-4 font-bold uppercase text-left">Start Date</th>
              <th className="px-6 py-4 font-bold uppercase text-left">End Date</th>
              <th className="px-6 py-4 font-bold uppercase text-left">Technician</th>
              <th className="px-6 py-4 font-bold uppercase text-left">Status</th>
            </tr>
          </thead>
          {loading ? (
            <TableLoader />
          ) : (
            <tbody>
              {currentRequests.map((request) => (
                <tr
                  key={request.id}
                  className="border-b text-sm hover:bg-gray-50"
                >
                  <td className="px-6 py-4 text-left">{request.id}</td>
                  <td className="px-6 py-4 text-left">{request.service}</td>
                  <td className="px-6 py-4 text-left">{request.clientName}</td>
                  <td className="px-6 py-4 text-left">{request.startDate}</td>
                  <td className="px-6 py-4 text-left">{request.endDate}</td>
                  <td className="px-6 py-4 text-left font-medium text-gray-900">
                    {request.technicianTitle}
                  </td>
                  <td className="px-6 py-4 text-base capitalize text-left">
                    <span
                      className={`px-2 py-1 rounded-md ${
                        request.status === "completed"
                          ? "bg-green-100 text-green-500 font-semibold"
                          : request.status === "ongoing"
                          ? "bg-blue-100 font-semibold text-blue-500"
                          : request.status === "pending"
                          ? "bg-[#ffa85633] text-[#FFA756] font-semibold"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {request.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
{/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border- border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-b-lg">
            <div>
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">
                  {(currentPage - 1) * itemsPerPage + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(
                    currentPage * itemsPerPage,
                    filteredRequests.length
                  )}
                </span>{" "}
                of{" "}
                <span className="font-medium">{filteredRequests.length}</span>{" "}
                results
              </p>
            </div>
            <div className="flex">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-l-md bg-white px-2 py-2 text-gray-400 border-l border-t border-b border-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              >
                <span className="sr-only">Previous</span>
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center rounded-r-md bg-white px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              >
                <span className="sr-only">Next</span>
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
    </div>
  );
}

export default Projects;
