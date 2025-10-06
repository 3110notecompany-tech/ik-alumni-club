"use client";

import { debounce, useQueryState } from "nuqs";
import { Input } from "./ui/input";
import { fa } from "zod/v4/locales";

export function PetSearchForm() {
  const [name, setName] = useQueryState("name", {
    defaultValue: "",
    shallow: false,
  });

  return (
    <div>
      <Input
        value={name}
        onChange={(e) =>
          setName(e.target.value, {
            limitUrlUpdates: e.target.value === "" ? undefined : debounce(500),
          })
        }
      />
    </div>
  );
}
