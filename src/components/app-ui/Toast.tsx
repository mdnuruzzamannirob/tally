// The current shadcn setup uses Sonner for notifications. Keep this adapter
// file so existing imports fail gracefully while the app migrates to `Toaster`.
export { Toaster } from "@/components/ui/sonner";
export { toast } from "sonner";
