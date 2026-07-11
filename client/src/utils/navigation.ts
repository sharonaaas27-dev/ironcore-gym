type NavigateFn = (path: string) => void;

let navigateFn: NavigateFn | null = null;

export function setNavigate(fn: NavigateFn) {
  navigateFn = fn;
}

export function navigate(path: string) {
  if (navigateFn) {
    navigateFn(path);
  } else {
    window.location.href = path;
  }
}
