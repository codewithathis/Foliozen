type DeviceResources = {
  hardwareConcurrency?: number;
  deviceMemory?: number;
  connection?: { saveData?: boolean; effectiveType?: string };
};

export function hasLimitedResources(device?: DeviceResources): boolean {
  const resources =
    device ??
    (typeof navigator === "undefined"
      ? {}
      : (navigator as Navigator & DeviceResources));
  const {
    hardwareConcurrency: cores,
    deviceMemory: memory,
    connection,
  } = resources;
  return (
    (cores !== undefined && cores > 0 && cores <= 4) ||
    (memory !== undefined && memory > 0 && memory <= 4) ||
    connection?.saveData === true ||
    connection?.effectiveType === "2g" ||
    connection?.effectiveType === "slow-2g"
  );
}
