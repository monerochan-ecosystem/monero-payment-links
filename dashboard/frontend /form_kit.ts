import { html } from "@spirobel/mininext";

export type FormState<T> = {
  open: boolean;
  draft: T;
  errors: Record<string, string>;
  saving: boolean;
  confirmDelete: boolean;
};

export type Issue = { path: string[]; message: string };

export function newFormState<T>(draft: T): FormState<T> {
  return { open: false, draft, errors: {}, saving: false, confirmDelete: false };
}

export function openForm<T>(state: FormState<T>, draft: T) {
  state.draft = draft;
  state.errors = {};
  state.saving = false;
  state.confirmDelete = false;
  state.open = true;
}

export function bind<T>(state: FormState<T>, key: keyof T & string) {
  return (e: Event) => {
    (state.draft as Record<string, unknown>)[key] = (
      e.target as HTMLInputElement
    ).value;
  };
}

export function inputClass(
  state: FormState<unknown>,
  name: string,
  extra = "",
) {
  return `form-input ${extra} ${state.errors[name] ? "error" : ""}`;
}

export function errorMessage(
  state: FormState<unknown>,
  name: string,
  cls = "error-message",
) {
  const msg = state.errors[name];
  return html`<div class="${cls}" style=${msg ? "display: block" : null}>
    ${msg ?? ""}
  </div>`;
}

export function submitButton(
  state: FormState<unknown>,
  text: string,
  style = "",
) {
  return html`<button
    type="submit"
    class="submit-btn ${state.saving ? "loading" : ""}"
    disabled=${state.saving}
    style="${style}"
  >
    <span class="spinner"></span>
    <span class="button-text">${text}</span>
  </button>`;
}

export function closeOnOverlay(state: FormState<unknown>) {
  return (e: Event) => {
    if (e.target === e.currentTarget) state.open = false;
  };
}

export function setIssues(state: FormState<unknown>, issues: Issue[] = []) {
  state.errors = {};
  for (const issue of issues) {
    const name = issue.path[0] || "_form";
    state.errors[name] = issue.message;
  }
}

export function applyDashboard(data: unknown) {
  if (data && typeof data === "object")
    Object.assign(window.dashboardData, data);
}

export async function postJson(url: string, body: unknown) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

let copiedUrl: string | null = null;

const copyIcon = html`<svg
  width="16"
  height="16"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
>
  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
</svg>`;

export function copyButton(url: string) {
  const onclick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    copiedUrl = url;
    setTimeout(() => {
      if (copiedUrl === url) copiedUrl = null;
    }, 2000);
  };
  return html`<button class="copy-link-btn" onclick=${onclick}>
    ${copiedUrl === url ? "Copied!" : copyIcon}
  </button>`;
}
