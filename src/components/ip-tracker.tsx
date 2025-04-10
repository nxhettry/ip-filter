"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import type { IpData } from "@/lib/models/ip-data";
import { toast } from "sonner";

// const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

// if (!baseUrl) {
//   throw new Error("NEXT_PUBLIC_BASE_URL is not defined");
// }

export default function IpTracker() {
  const [ipAddress, setIpAddress] = useState("");
  const [country, setCountry] = useState("");
  const [vpn, setVpn] = useState("");
  const [ipData, setIpData] = useState<IpData[]>([]);
  const [isCountryDialogOpen, setIsCountryDialogOpen] = useState(false);
  const [isVpnDialogOpen, setIsVpnDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    fetchIpData();
  }, []);

  async function fetchIpData() {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/ips`);

      if (response.status !== 200) {
        toast.error("Failed to fetch IP data");
        return;
      }

      const data = await response.json();

      setIpData(data.data);
    } catch (error) {
      console.error("Failed to fetch IP data:", error);
      toast.error("Failed to load IP data");
    } finally {
      setIsLoading(false);
    }
  }

  function handleAddClick() {
    // Simple IP validation
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(ipAddress)) {
      toast.error("Please enter a valid IP address");
      return;
    }

    setIsCountryDialogOpen(true);
  }

  async function handleVpnSubmit() {
    setIsLoading(true);

    const data = {
      ip: ipAddress,
      country,
      vpn,
    };

    try {
      const res = await fetch(`/api/ips`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (res.status !== 200) {
        toast.error("Failed to add entry");
      } else {
        toast.success("IP added to the list");
      }

      // Reset form and close dialog
      setIpAddress("");
      setCountry("");
      setVpn("");
      setIsVpnDialogOpen(false);

      // Refresh data
      await fetchIpData();
    } catch (error) {
      console.error("Failed to add IP data:", error);
      toast.error("Failed to add IP data");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          type="text"
          placeholder="Enter IP address"
          value={ipAddress}
          onChange={(e) => setIpAddress(e.target.value)}
          className="flex-grow"
          list="ip-suggestions"
        />
        <datalist id="ip-suggestions">
          {ipData.map((item, index) => (
            <option key={index} value={item.ip}>
              {item.ip}
            </option>
          ))}
        </datalist>
        <Button onClick={handleAddClick}>Add to List</Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted">
              <th className="p-2 text-left">IP</th>
              <th className="p-2 text-left">Country</th>
              <th className="p-2 text-left">VPN</th>
            </tr>
          </thead>
          <tbody>
            {ipData.length > 0 ? (
              ipData.map((item, index) => (
                <tr key={index} className="border-b border-muted">
                  <td className="p-2">{item.ip}</td>
                  <td className="p-2">{item.country}</td>
                  <td className="p-2">{item.vpn}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={3}
                  className="p-4 text-center text-muted-foreground"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Country Dialog */}
      <Dialog open={isCountryDialogOpen} onOpenChange={setIsCountryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Country</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="mt-2"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCountryDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setIsCountryDialogOpen(false);
                setIsVpnDialogOpen(true);
              }}
              disabled={!country}
            >
              Next
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* VPN Dialog */}
      <Dialog open={isVpnDialogOpen} onOpenChange={setIsVpnDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter VPN</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="vpn">VPN Name</Label>
            <Input
              id="vpn"
              value={vpn}
              onChange={(e) => setVpn(e.target.value)}
              className="mt-2"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsVpnDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleVpnSubmit} disabled={!vpn || isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
