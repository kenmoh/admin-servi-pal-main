'use client'

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useQuery } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { getUserProfile } from "@/actions/user";

interface UserProfileModalProps {
  userId: string;
  trigger?: React.ReactNode;
}

export function UserProfileModal({ userId, trigger }: UserProfileModalProps) {
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['userProfile', userId],
    queryFn: () => getUserProfile(userId),
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline">View Profile</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-64 w-full rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          </div>
        ) : error || (profile && 'error' in profile) ? (
          <div className="text-red-500 text-center py-8">
            Error loading profile: {error?.message || (profile as { error: string }).error}
          </div>
        ) : profile ? (
          <>
            <DialogHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={profile.profile_image_url || profile.backdrop_image_url} />
                  <AvatarFallback>
                    {profile?.full_name?.charAt(0) || profile?.business_name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <DialogTitle>User Profile</DialogTitle>
                  <DialogDescription>
                    {profile?.business_name || profile?.store_name || profile.user_type}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Basic Information</h3>
                <div className="space-y-2">
                  <div className="text-sm">
                    <div className="font-medium">ID</div>
                    <div>{profile.user_id}</div>
                  </div>
                 
                  <div className="text-sm">
                    <div className="font-medium">User Type</div>
                    <div className="capitalize">{profile.user_type}</div>
                  </div>
                </div>
              </div>

              {/* Profile Information */}
              {profile && (
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Profile Details</h3>
                  <div className="space-y-2">
                    {(profile.full_name || profile.business_name) && (
                      <div className="text-sm">
                        <div className="font-medium">Full Name</div>
                        <div>{profile.full_name || profile.business_name}</div>
                      </div>
                    )}
                    {profile.phone_number && (
                      <div className="text-sm">
                        <div className="font-medium">Phone Number</div>
                        <div>{profile.phone_number}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Business Information */}
              {profile?.business_name && (
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Business Information</h3>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <div className="font-medium">Business Name</div>
                      <div>{profile.business_name}</div>
                    </div>
                    {profile.store_name && (
                      <div className="text-sm">
                        <div className="font-medium">Store Name</div>
                        <div>{profile.store_name}</div>
                      </div>
                    )}
                    {profile.business_address && (
                      <div className="text-sm">
                        <div className="font-medium">Business Address</div>
                        <div>{profile.business_address}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Banking Information */}
              {profile?.bank_name && (
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Banking Information</h3>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <div className="font-medium">Bank Name</div>
                      <div>{profile.bank_name}</div>
                    </div>
                    {profile.bank_account_number && (
                      <div className="text-sm">
                        <div className="font-medium">Account Number</div>
                        <div>{profile.bank_account_number}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-8">No profile data available</div>
        )}
      </DialogContent>
    </Dialog>
  )
}