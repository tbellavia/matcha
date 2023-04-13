import _ from "lodash";
import { useState } from "react";

export default function useUniqueId(prefix) {
    return useState(_.uniqueId(`${prefix}_`));
}