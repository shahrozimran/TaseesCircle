export const useRouter = () => ({ refresh() {}, push() {}, replace() {} });
export const usePathname = () =>
  new URLSearchParams(location.search).get("path") || "/dashboard";
export const useSearchParams = () => new URLSearchParams(location.search);
export const useParams = () => ({ id: "fixture-circle" });
