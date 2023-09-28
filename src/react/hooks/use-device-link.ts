import { DeepClient } from "@deep-foundation/deeplinks/imports/client.js";
import { Link } from "@deep-foundation/deeplinks/imports/minilinks.js";
import { useState, useEffect } from "react";
import { DeviceDecorator } from "../../main.js";
import { packageLog } from "../../package-log.js";

export interface UseDeviceLinkReturn {
  deviceLinkId: number | undefined;
  isLoading: boolean;
  error: unknown;
}

export interface UseDeviceLinkOptions {
  initialDeviceLinkId?: number;
  deep: DeviceDecorator;
  containerLinkId?: number;
}

export function useDeviceLink(options: UseDeviceLinkOptions): UseDeviceLinkReturn {
  const log = packageLog.extend(useDeviceLink.name);
  const { initialDeviceLinkId, deep, containerLinkId = deep.linkId! } = options;
  const [deviceLinkId, setDeviceLinkId] = useState<number | undefined>(
    initialDeviceLinkId
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const checkAndInsertDeviceLink = async () => {
      setIsLoading(true);
      setError(null);

      try {
        let deviceLink: Link<number> | undefined;
        if (initialDeviceLinkId) {
          deviceLink = await deep
            .select(initialDeviceLinkId)
            .then((result) => result.data[0]);
        }
        log({ deviceLink });

        if (!initialDeviceLinkId || !deviceLink) {
          const { deviceLinkId: newDeviceLinkId } = await deep.insertDevice({
            containerLinkId,
          });
          log({ newDeviceLinkId });
          setDeviceLinkId(newDeviceLinkId);
        }
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (deviceLinkId !== undefined) {
      checkAndInsertDeviceLink();
    }
  }, [deviceLinkId]);

  return {
    deviceLinkId,
    isLoading,
    error,
  };
};
