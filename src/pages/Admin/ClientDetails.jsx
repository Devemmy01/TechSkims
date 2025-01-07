import { useState, useEffect } from "react";
import {
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  Clock,
  Calendar,
  HourglassIcon,
  Search,
} from "lucide-react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function ClientHeader({ client }) {
  if (!client || !client.user) return null;

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row gap-5 w-full items-start md:items-center">
        <div className="flex items-center gap-4 w-full md:w-1/3 bg-white whitespace-nowrap p-4 rounded-lg shadow-sm">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-purple-100 rounded-full flex items-center justify-center">
            {client.user.thumbnail ? (
              <img
                src={client.user.thumbnail}
                alt={client.user.name}
                className="w-12 h-12 rounded-full"
              />
            ) : (
              <span className="text-[#00A8E8] text-4xl font-semibold">
                {client.user.name?.charAt(0) || "U"}
              </span>
            )}
          </div>
          <h1 className="text-xl">{client.user.name}</h1>
        </div>
        <div className="flex flex-col sm:flex-row md:justify-between md:px-14 gap-8 bg-white p-3 md:p-6 rounded-md shadow-sm w-full">
          <div className="flex items-center gap-4 text-gray-900">
            <Phone className="w-6 h-6" />
            <div className="flex flex-col">
              <p className="text-sm">Mobile</p>
              <span className="font-semibold">
                {client.user.phone || "N/A"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-gray-900">
            <Mail className="w-6 h-6" />
            <div className="flex flex-col">
              <p className="text-sm">Email</p>
              <span className="font-semibold">{client.user.email}</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-gray-900">
            <MapPin className="w-6 h-6" />
            <div className="flex flex-col">
              <p className="text-sm">Location</p>
              <span className="font-semibold">
                {client.user.location || "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricsCard({ count, label, icon: Icon, color }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex items-center gap-4">
        <div
          className={`w-10 h-10 bg-[#00A8E8] rounded-full flex items-center justify-center`}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="text-2xl font-bold">{count}</div>
          <div className="text-sm text-gray-600">{label}</div>
        </div>
      </div>
    </div>
  );
}

function ProjectsProgress({ percentage }) {
  const validPercentage = isNaN(percentage) ? 0 : percentage;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset =
    circumference - (validPercentage / 100) * circumference;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm w-full md:w-[600px]">
      <h2 className="text-lg font-semibold mb-4">Projects Progress</h2>
      <div className="flex justify-center">
        <div className="relative">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="45"
              stroke={validPercentage === 0 ? "#FAF5FF" : "#00A8E8"}
              strokeWidth="10"
              fill="none"
            />
            <circle
              cx="64"
              cy="64"
              r="45"
              stroke={validPercentage === 0 ? "#FAF5FF" : "#00A8E8"}
              strokeWidth="10"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold">
              <svg width="100" height="100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="#00A8E8"
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                />
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dy=".3em"
                  fontSize="30"
                >
                  {validPercentage}%
                </text>
              </svg>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ClientDetails() {
  const { id } = useParams(); // Get client ID from URL
  const [clientData, setClientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClientDetails = async () => {
      try {
        const authToken = localStorage.getItem("authToken");

        const response = await axios.get(
          `https://beta.techskims.tech/api/admin/clients/${id}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              Accept: "application/json",
            },
          }
        );

        if (response.data && response.data.data) {
          setClientData(response.data.data);
        } else {
          throw new Error("No client data received");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching client details:", error);

        if (error.response?.status === 401) {
          toast.error("Session expired. Please login again.");
          window.location.href = "/login";
        } else {
          setError(
            error.response?.data?.message || "Failed to fetch client details"
          );
          toast.error(
            error.response?.data?.message || "Failed to fetch client details"
          );
        }
        setLoading(false);
      }
    };

    if (id) {
      fetchClientDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F8F8] absolute w-full lg:w-[calc(100%-256px)] p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading client details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8F8F8] absolute w-full lg:w-[calc(100%-256px)] p-4 md:p-8 flex items-center justify-center">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold">Error</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] overflow-y-auto bg-[#F8F8F8] absolute w-full lg:w-[calc(100%-256px)] p-4 md:p-8 scrollbar-custom z-[9999] pb-10">
      <style jsx>{`
        .scrollbar-custom::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        .scrollbar-custom::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        .scrollbar-custom::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 4px;
        }
        .scrollbar-custom::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>

      <div className="max-w-7xl mx-auto space-y-6">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-gray-900">
            Client Profile
          </h1>
          <p className="text-sm text-gray-500">
            See more details about the client here.
          </p>
        </div>

        <ClientHeader client={clientData} />

        <div className="grid md:flex md:flex-wrap md:justify-evenly gap-6">
          <MetricsCard
            count={clientData?.completedProject || 0}
            label="Completed Projects"
            icon={CheckCircle}
            color="bg-green-500"
          />
          <MetricsCard
            count={clientData?.ongoingProject || 0}
            label="Ongoing Projects"
            icon={Clock}
            color="bg-blue-500"
          />
          <MetricsCard
            count={clientData?.upcomingProjects || 0}
            label="Upcoming Projects"
            icon={Calendar}
            color="bg-purple-500"
          />
          <MetricsCard
            count={clientData?.pendingProjects || 0}
            label="Pending Projects"
            icon={HourglassIcon}
            color="bg-yellow-500"
          />
        </div>

        <div className="flex items-center pt-5 justify-center">
          <ProjectsProgress
            percentage={
              clientData
                ? Math.round(
                    (clientData.completedProject /
                      (clientData.completedProject +
                        clientData.ongoingProject +
                        clientData.pendingProjects)) *
                      100
                  )
                : 0
            }
          />
        </div>
      </div>
    </div>
  );
}
