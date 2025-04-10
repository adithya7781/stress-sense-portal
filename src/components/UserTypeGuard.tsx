
import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, UserType } from "@/types";

interface UserTypeGuardProps {
  children: ReactNode;
  user: User | null;
  allowedTypes: UserType[];
}

const UserTypeGuard = ({ children, user, allowedTypes }: UserTypeGuardProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    if (!allowedTypes.includes(user.type)) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, allowedTypes, navigate]);

  if (!user || !allowedTypes.includes(user.type)) {
    return null;
  }

  return <>{children}</>;
};

export default UserTypeGuard;
