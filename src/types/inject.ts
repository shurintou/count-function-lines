import type { Ref, ComputedRef, InjectionKey } from 'vue'

type WindowWidthInjectKey = Ref<number>
type GridTypeInjectKey = ComputedRef<"xl" | "lg" | "md" | "sm" | "xs">
type IsPcModeInjectKey = ComputedRef<boolean>
type IsSpModeInjectKey = ComputedRef<boolean>

export const windowWidthKey = Symbol() as InjectionKey<WindowWidthInjectKey>
export const gridTypeKey = Symbol() as InjectionKey<GridTypeInjectKey>
export const isPcModeKey = Symbol() as InjectionKey<IsPcModeInjectKey>
export const isSpModeKey = Symbol() as InjectionKey<IsSpModeInjectKey>
