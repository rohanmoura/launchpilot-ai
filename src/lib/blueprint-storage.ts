"use client";

import { demoBlueprints } from "@/data/demo-blueprints";
import type { Blueprint, BlueprintSummary } from "@/types/blueprint";

const STORAGE_KEY = "launchpilot.blueprints";
const STORAGE_EVENT = "launchpilot:blueprints";
const DEMO_BLUEPRINTS_JSON = JSON.stringify(demoBlueprints);

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

export function getBlueprints(): Blueprint[] {
  if (!canUseStorage()) {
    return demoBlueprints;
  }

  const rawValue = window.localStorage.getItem(STORAGE_KEY);

  if (!rawValue) {
    return demoBlueprints;
  }

  try {
    const parsed = JSON.parse(rawValue) as Blueprint[];
    return Array.isArray(parsed) ? parsed : demoBlueprints;
  } catch {
    return demoBlueprints;
  }
}

export function saveBlueprint(blueprint: Blueprint) {
  if (!canUseStorage()) {
    return;
  }

  const blueprints = getBlueprints();
  const nextBlueprints = [
    blueprint,
    ...blueprints.filter((item) => item.id !== blueprint.id),
  ];

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextBlueprints));
  window.dispatchEvent(new Event(STORAGE_EVENT));
}

export function deleteBlueprint(id: string) {
  if (!canUseStorage()) {
    return;
  }

  const nextBlueprints = getBlueprints().filter((blueprint) => blueprint.id !== id);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextBlueprints));
  window.dispatchEvent(new Event(STORAGE_EVENT));
}

export function getBlueprintById(id: string) {
  return getBlueprints().find((blueprint) => blueprint.id === id) ?? null;
}

export function getBlueprintSummaries(): BlueprintSummary[] {
  return getBlueprints().map((blueprint) => ({
    id: blueprint.id,
    status: blueprint.status,
    createdAt: blueprint.createdAt,
    updatedAt: blueprint.updatedAt,
    productName: blueprint.productName,
    oneLinePitch: blueprint.oneLinePitch,
    projectType: blueprint.input.projectType,
  }));
}

export function subscribeToBlueprintStorage(listener: () => void) {
  if (!canUseStorage()) {
    return () => {};
  }

  window.addEventListener("storage", listener);
  window.addEventListener(STORAGE_EVENT, listener);

  return () => {
    window.removeEventListener("storage", listener);
    window.removeEventListener(STORAGE_EVENT, listener);
  };
}

export function getBlueprintsSnapshot() {
  if (!canUseStorage()) {
    return DEMO_BLUEPRINTS_JSON;
  }

  return window.localStorage.getItem(STORAGE_KEY) ?? DEMO_BLUEPRINTS_JSON;
}
