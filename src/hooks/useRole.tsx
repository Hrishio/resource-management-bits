import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export type UserRole = "admin" | "resource" | "user";

export const useRole = () => {
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setRole(null);
      setLoading(false);
      return;
    }

    fetchUserRole();
  }, [user]);

  const fetchUserRole = async () => {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user?.id)
        .single();

      if (error) {
        console.error("Error fetching role:", error);
        setRole(null);
      } else {
        setRole(data.role as UserRole);
      }
    } catch (error) {
      console.error("Error fetching role:", error);
      setRole(null);
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = role === "admin";
  const isResource = role === "resource";
  const isUser = role === "user";

  return {
    role,
    loading,
    isAdmin,
    isResource,
    isUser,
    refetch: fetchUserRole
  };
};