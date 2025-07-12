import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const TitleReset = () => {
  const location = useLocation();

  useEffect(() => {
    const publicRoutes = ["/", "/about", "/contacts", "/faq", "/terms", "/privacy"];
    const isPublic = publicRoutes.includes(location.pathname);
    if (isPublic) {
      document.title = "MTech Kidz Explore";
    }
  }, [location]);

  return null;
};

export default TitleReset;