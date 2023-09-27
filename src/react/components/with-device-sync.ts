import { DeepClient, DeepClientInstance } from '@deep-foundation/deeplinks/imports/client.js';
import { useState, useEffect } from 'react';
import { UseDeviceSyncOptions, useDeviceSync } from '../hooks/use-device-sync.js';
import { DeviceDecorator } from '../../create-device-decorator.js';

/**
 * A higher-order component that handles the logic of inserting a device link into Deep if it does not exist and saving device information.
 *
 * @remarks
 * This component utilizes the custom hook {@link useDeviceSync} to manage the device link insertion operation and handles the rendering logic based on the loading and insertion state of Device link insertion.
 *
 * @returns A JSX.Element that is either the children of this component if Device link is available, or the result of {@link WithDeviceSyncOptions.renderIfLoading} if the insertion operation is loading, or the result of {@link WithDeviceSyncOptions.renderIfNotInserted} if the device link is not inserted.
 */
export function WithDeviceSync<TDeepClient extends DeepClientInstance = DeepClientInstance>(
  this: DeviceDecorator,
  options: WithDeviceSyncOptions<TDeepClient>
): JSX.Element {
  const {
    renderChildren: renderChildren,
    renderIfLoading,
    renderIfNotInserted,
  } = options;

  const { isLoading,deviceLinkId } = this.useDeviceSync(options);

  if (isLoading) {
    return renderIfLoading();
  }

  if (deviceLinkId) {
    return renderChildren({deviceLinkId});
  } else {
    return renderIfNotInserted();
  }
}

/**
 * Describes the Optionseter object for the {@link WithDeviceSync} higher-order component.
 *
 * @remarks
 * This interface extends from {@link UseDeviceSyncOptions}, and adds additional properties required for rendering.
 */
export type WithDeviceSyncOptions<TDeepClient extends DeepClientInstance = DeepClientInstance> =
  UseDeviceSyncOptions & {
    /**
     * The ID of the container link in the Deep database.
     */
    containerLinkId: number;
    /**
     * The ID of the device link in the Deep database.
     */
    deviceLinkId: number | undefined | null;
    /**
     * A function that returns a JSX.Element to render when the device link ID exists and the loading is finished.
     */
    renderChildren: (options:{deviceLinkId:number}) => JSX.Element;
    /**
     * A function that returns a JSX.Element to render when the insertion operation is loading.
     */
    renderIfLoading: () => JSX.Element;
    /**
     * A function that returns a JSX.Element to render when the device link ID doesn't exist.
     */
    renderIfNotInserted: () => JSX.Element;
  };