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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "../../components/ui/button";

const BASE_URL = "https://beta.techskims.tech/api";

function TechniciansProjects() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState("all");
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskDetails, setTaskDetails] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get(`${BASE_URL}/technician/tasks`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.status === "success") {
          setRequests(response.data.data);
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

  // Add this function near your other handlers
  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  // Replace your existing filteredRequests definition with this:
  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.request?.service
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      request.request?.technicianTitle
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (status === "all") return true;
    return request.request?.status?.toLowerCase() === status.toLowerCase();
  });

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRequests = filteredRequests.slice(startIndex, endIndex);

  const handleRowClick = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const TaskDetailsModal = ({ isOpen, onClose, task }) => {
    if (!task) return null;

    return (
      <Dialog open={isOpen} onOpenChange={() => onClose()}>
        <DialogContent className="max-w-3xl max-h-[90vh] z-[9999] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Task Details #{task.id}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">
                  Technician Details
                </h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-gray-600">ID:</span>{" "}
                    {task.technicianId}
                  </p>
                  <p>
                    <span className="text-gray-600">Name:</span>{" "}
                    {task.technician}
                  </p>
                  <p>
                    <span className="text-gray-600">Pay Type:</span>{" "}
                    {task.technicianPayType}
                  </p>
                  <p>
                    <span className="text-gray-600">Rate:</span> $
                    {task.technicianRate}/hr
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-2">
                  Request Information
                </h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-gray-600">Request ID:</span>{" "}
                    {task.request.id}
                  </p>
                  <p>
                    <span className="text-gray-600">Client:</span>{" "}
                    {task.request.client}
                  </p>
                  <p>
                    <span className="text-gray-600">Service:</span>{" "}
                    {task.request.service}
                  </p>
                  <p>
                    <span className="text-gray-600">Technician Title:</span>{" "}
                    {task.request.technicianTitle}
                  </p>
                  <p>
                    <span className="text-gray-600">Contact:</span>{" "}
                    {task.request.contactNo}
                  </p>
                  <p>
                    <span className="text-gray-600">Location:</span>{" "}
                    {task.request.location}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-2">
                  Project Timeline
                </h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-gray-600">Start Date:</span>{" "}
                    {task.request.startDate}
                  </p>
                  <p>
                    <span className="text-gray-600">Start Time:</span>{" "}
                    {task.request.startTime}
                  </p>
                  <p>
                    <span className="text-gray-600">End Date:</span>{" "}
                    {task.request.endDate}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">
                  Project Details
                </h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-gray-600">Description:</span>{" "}
                    {task.request.description}
                  </p>
                  <p>
                    <span className="text-gray-600">Special Tools:</span>{" "}
                    {task.request.specialTools}
                  </p>
                  <p>
                    <span className="text-gray-600">Pickup Location:</span>{" "}
                    {task.request.pickupLocation}
                  </p>
                  <p>
                    <span className="text-gray-600">Pay Type:</span>{" "}
                    {task.request.payType}
                  </p>
                  <p>
                    <span className="text-gray-600">Rate:</span> $
                    {task.request.rate}/hr
                  </p>
                  <p>
                    <span className="text-gray-600">Task Status:</span>
                    <span
                      className={`ml-2 px-2 py-1 rounded-md ${
                        task.request.status === "completed"
                          ? "bg-green-100 text-green-500"
                          : task.request.status === "ongoing"
                          ? "bg-blue-100 text-blue-500"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {task.request.status}
                    </span>
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-2">
                  Deliverables
                </h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-gray-600">Task Deliverables:</span>{" "}
                    {task.deliverables}
                  </p>
                  <p>
                    <span className="text-gray-600">Request Deliverables:</span>{" "}
                    {task.request.deliverables}
                  </p>
                  <p>
                    <span className="text-gray-600">
                      Delivery Instructions:
                    </span>{" "}
                    {task.request.deliveryInstructions}
                  </p>
                </div>
              </div>

              {task.request.images && task.request.images.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">
                    Project Images
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {task.request.images.map((img) => (
                      <div key={img.id} className="relative">
                        <img
                          src={img.image}
                          alt={`Project image ${img.id}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

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
      <div className="w-full items-center mt-10 pb-3">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-[600] text-[#202224]">Projects</h1>
          <p className="text-[#666666] text-sm text-[500] pb-3">
            Manage your projects
          </p>
        </div>
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

      <div className="overflow-x-auto border shadow-sm rounded-[8px] bg-white">
        <table className="w-full min-w-[800px] table-auto">
          <thead>
            <tr className="border-b text-sm text-gray-600 bg-gray-50">
              <th className="px-6 py-4 font-medium text-left w-16">ID</th>
              <th className="px-6 py-4 font-medium text-left">Project Type</th>
              <th className="px-6 py-4 font-medium text-left">Start Date</th>
              <th className="px-6 py-4 font-medium text-left">End Date</th>
              <th className="px-6 py-4 font-medium text-left">Technician</th>
              <th className="px-6 py-4 font-medium text-left">Status</th>
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
                  onClick={() => handleRowClick(request)}
                >
                  <td className="px-6 py-4 text-left">{request.id}</td>
                  <td className="px-6 py-4 text-left">
                    {request.request.service}
                  </td>
                  <td className="px-6 py-4 text-left">
                    {request.request.startDate}
                  </td>
                  <td className="px-6 py-4 text-left">
                    {request.request.endDate}
                  </td>
                  <td className="px-6 py-4 text-left font-medium text-gray-900">
                    {request.request.technicianTitle}
                  </td>
                  <td className="px-4 py-2 text-[14px] capitalize text-left">
                    <span
                      className={`ml-2 px-2 py-1 rounded-md ${
                        request.request.status === "completed"
                          ? "bg-green-100 text-green-500"
                          : request.request.status === "ongoing"
                          ? "bg-blue-100 text-blue-500"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {request.request.status}
                    </span>
                  </td>
                  <td onClick={() => handleRowClick(request)}>
                    <Button className="bg-[#00A8E8]">View task</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-b-lg">
          <div>
            <p className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">
                {(currentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, filteredRequests.length)}
              </span>{" "}
              of <span className="font-medium">{filteredRequests.length}</span>{" "}
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
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
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
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
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

      <TaskDetailsModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
      />
    </div>
  );
}

export default TechniciansProjects;
