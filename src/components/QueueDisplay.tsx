/// updated to hide queue for users and added join button
import React from "react";
import { useQueue } from "../contexts/QueueContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button"; // ✅ import your Button component
import { Clock, Users } from "lucide-react";

export const QueueDisplay: React.FC = () => {
  const { queue, currentPosition, refreshQueue } = useQueue();

  const activeUsers = queue.filter(user => user.isActive && user.position >= currentPosition);
  const myEntry = queue.find(u => u.id === localStorage.getItem("queueUserId"));
  const myPosition = myEntry?.position ?? null;
  const peopleAhead = myPosition !== null ? myPosition - currentPosition : null;

  const joinQueue = async () => {
    try {
      await fetch("/api/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: localStorage.getItem("queueUserId") }),
      });
      refreshQueue?.(); // ✅ Re-fetch queue after joining if your context supports it
    } catch (err) {
      console.error("Failed to join queue:", err);
    }
  };

  return (
    <Card className="glass-card w-full">
      <CardHeader className="space-y-1 pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold text-primary">
            Queue Status
          </CardTitle>
          <Badge variant="outline" className="flex gap-1 items-center">
            <Users size={14} />
            <span>{activeUsers.length} waiting</span>
          </Badge>
        </div>
        <div className="text-md text-muted-foreground flex items-center gap-2">
          <Clock size={16} className="text-primary" />
          <span>Now serving: <span className="font-medium text-primary">#{currentPosition}</span></span>
        </div>
      </CardHeader>

      <CardContent>
        {activeUsers.length === 0 ? (
          <div className="py-6 text-center text-muted-foreground animate-pulse-soft">
            <p>No one is currently in the queue</p>
            <p className="text-sm mt-1">Be the first to join!</p>
          </div>
        ) : myPosition !== null ? (
          <div className="py-4 text-muted-foreground text-center">
            <p>You are number <span className="font-semibold text-primary">{myPosition}</span> in the queue.</p>
            <p>{peopleAhead} {peopleAhead === 1 ? "person" : "people"} ahead of you.</p>
          </div>
        ) : (
          <div className="py-4 text-center text-muted-foreground space-y-3">
            <p>You’re not currently in the queue.</p>
            <Button onClick={joinQueue} className="mt-2">
              Join Queue
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};