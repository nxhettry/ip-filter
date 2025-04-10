"use client";

import { useState } from "react";
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
import { addIpData } from "@/lib/actions";
import type { IpData } from "@/lib/models/ip-data";
import { toast } from "sonner";

export default function IpTracker() {
  const [ipAddress, setIpAddress] = useState("");
  const [country, setCountry] = useState("");
  const [vpn, setVpn] = useState("");
  const [ipData, setIpData] = useState<IpData[]>([]);
  const [isCountryDialogOpen, setIsCountryDialogOpen] = useState(false);
  const [isVpnDialogOpen, setIsVpnDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch data on component mount
  useState(() => {
    fetchIpData();
  });

  async function fetchIpData() {
    try {
      const response = await fetch("/api/ip-data");
      if (response.ok) {
        const data = await response.json();
        setIpData(data);
      }
    } catch (error) {
      console.error("Failed to fetch IP data:", error);
      toast.error("Failed to load IP data");
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
    try {
      await addIpData({
        ip: ipAddress,
        country,
        vpn,
      });

      // Reset form and close dialog
      setIpAddress("");
      setCountry("");
      setVpn("");
      setIsVpnDialogOpen(false);

      // Refresh data
      await fetchIpData();

      toast.success("IP data added successfully");
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
        />
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
