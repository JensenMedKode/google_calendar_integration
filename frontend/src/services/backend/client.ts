/* istanbul ignore file */
import fetch from "isomorphic-unfetch";
import { GetServerSidePropsContext } from "next";
import { getAuthToken } from "services/auth/useAuthContextValue";
import isomorphicEnvSettings, { setEnvSettings } from "utils/envSettings";
import { ClientBase, ClientConfiguration } from "./client.generated";

export interface NSwagClient<T extends ClientBase> {
  new (
    configuration: ClientConfiguration,
    baseUrl?: string,
    http?: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> }
  ): T;
}

export const client = async <T extends ClientBase, V extends NSwagClient<T>>(
  Client: V,
  context?: GetServerSidePropsContext
): Promise<InstanceType<V>> => {
  let envSettings = isomorphicEnvSettings();

  if (envSettings === null && process.browser) {
    envSettings = await fetch("/api/getEnv").then(res => res.json());
    setEnvSettings(envSettings);
  }
  if (envSettings === null && !process.browser) {
    throw new Error("Environment settings null on server");
  }

  const authToken = getAuthToken(context) ?? "";
  const initializedClient = new Client(new ClientConfiguration(authToken), envSettings.backendUrl, {
    fetch
  }) as InstanceType<V>;

  return initializedClient;
};
