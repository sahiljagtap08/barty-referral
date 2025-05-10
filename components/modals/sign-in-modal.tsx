import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import Link from "next/link";

import { Icons } from "@/components/shared/icons";
import { buttonVariants } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

function SignInModal({
  showSignInModal,
  setShowSignInModal,
}: {
  showSignInModal: boolean;
  setShowSignInModal: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <Modal showModal={showSignInModal} setShowModal={setShowSignInModal}>
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center justify-center space-y-3 border-b bg-background px-4 py-6 pt-8 text-center md:px-16">
          <a href={siteConfig.url}>
            <Icons.logo className="h-10 w-auto" />
          </a>
          <h3 className="font-urban text-2xl font-bold">barty.</h3>
          <p className="text-sm text-gray-500">
            Get started with Barty to generate personalized referral emails.
          </p>
        </div>

        <div className="bg-secondary/50 px-4 py-8 md:px-16 flex flex-col items-center">
          <h4 className="font-medium text-center mb-4">Ready to boost your job search?</h4>
          <Link 
            href="/dashboard" 
            className={cn(buttonVariants({ className: "w-full gap-2" }))}
            onClick={() => setShowSignInModal(false)}
          >
            <span>Go to Dashboard</span>
            <Icons.arrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </Modal>
  );
}

export function useSignInModal() {
  const [showSignInModal, setShowSignInModal] = useState(false);

  const SignInModalCallback = useCallback(() => {
    return (
      <SignInModal
        showSignInModal={showSignInModal}
        setShowSignInModal={setShowSignInModal}
      />
    );
  }, [showSignInModal, setShowSignInModal]);

  return useMemo(
    () => ({
      setShowSignInModal,
      SignInModal: SignInModalCallback,
    }),
    [setShowSignInModal, SignInModalCallback],
  );
}
