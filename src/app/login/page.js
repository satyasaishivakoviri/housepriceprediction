import { AuthUI } from "@/components/ui/auth-fuse";

export default function LoginPage() {
    return (
        <main>
            <AuthUI initialView="signin" />
        </main>
    );
}
