/** Where `RequireAuth` stashes the page the user was heading to. */
export type RedirectState = {
  from?: { pathname?: string };
};

/** One selling point on the login page's showcase panel. */
export type LoginHighlight = {
  icon: string;
  title: string;
  body: string;
};
