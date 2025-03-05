import { useState, useEffect } from "react";
import {
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  Clock,
  Calendar,
  HourglassIcon,
} from "lucide-react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Improved Client Header Component
function ClientHeader({ client }) {
  if (!client || !client.user) return null;

  return (
    <Card className="w-full mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="relative">
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center overflow-hidden shadow-md">
              {client.user.thumbnail ? (
                <img
                  src={client.user.thumbnail}
                  alt={client.user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-[#00A8E8] text-4xl font-semibold">
                  {client.user.name?.charAt(0) || "U"}
                </span>
              )}
            </div>
            {client.user.isVerified === "yes" && (
              <div className="absolute bottom-0 right-0 bg-green-500 text-white rounded-full p-1">
                <CheckCircle size={16} />
              </div>
            )}
          </div>
          <div className="flex-grow">
            <h1 className="text-2xl font-bold text-gray-900">
              {client.user.name}
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary">
                {client.user.role?.[0] || "Client"}
              </Badge>
              <Badge
                variant={
                  client.user.status === "active" ? "default" : "destructive"
                }
              >
                {client.user.status}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Detailed Contact Information Component
function ContactInformation({ client }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 flex flex-col gap-4 md:flex-row md:justify-around items-center">
        <div className="flex items-center gap-4">
          <Phone className="w-5 h-5 text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="font-semibold">{client.user.phone || "N/A"}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Mail className="w-5 h-5 text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-semibold">{client.user.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <MapPin className="w-5 h-5 text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">Location</p>
            <p className="font-semibold">{client.user.location || "N/A"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Project Metrics Component
function ProjectMetrics({ clientData }) {
  const metrics = [
    {
      count: clientData?.completedProject || 0,
      label: "Completed Projects",
      icon: CheckCircle,
      color: "text-green-500",
    },
    {
      count: clientData?.ongoingProject || 0,
      label: "Ongoing Projects",
      icon: Clock,
      color: "text-blue-500",
    },
    {
      count: clientData?.pendingProjects || 0,
      label: "Pending Projects",
      icon: Calendar,
      color: "text-yellow-500",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          {metrics.map(({ count, label, icon: Icon, color }) => (
            <div
              key={label}
              className="bg-gray-50 p-4 rounded-lg flex items-center gap-3 hover:bg-gray-100 transition-colors"
            >
              <Icon className={`${color} w-6 h-6`} />
              <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-xl font-bold text-gray-800">{count}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function ClientDetails() {
  const { id } = useParams();
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading client details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold">Error</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8F8F8] w-full px-4 md:px-10 absolute md:relative h-screen overflow-y-scroll pb-10 scrollbar-custom pt-10">
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
      <div className=" mx-auto space-y-6">
        <ClientHeader client={clientData} />
        <ProjectMetrics clientData={clientData} />

        <div className="">
          <ContactInformation client={clientData} />
        </div>
      </div>
    </div>
  );
}
