import { User } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";

interface ProfileResponse {
  ok: boolean;
  profile: User;
  error: any;
}


export default function useUser(pathname?:string) {
  const router = useRouter();
  const url = 'api/users/me';
  const { data, error } = useSWR<ProfileResponse>(
    pathname === '/enter' ? null: url
  );


  useEffect(() => {
    if (data && !data.ok) {
      router.replace("/enter");
    }
  }, [data,router]);
 
  return { user: data?.profile, isLoading: !data && !error };
}
