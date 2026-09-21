"use client";

import React from "react";
import Badge from "@/components/ui/Badge";

const TONE_MAP = {
  active: "verified",
  suspended: "signal",
  "Réussi": "verified",
  "Traité": "slate",
  "Échoué": "signal",
  "Ouvert": "signal",
  "En cours": "ember",
  "Résolu": "verified",
  "Haute": "signal",
  "Moyenne": "ember",
  "Basse": "slate",
};

const LABEL_MAP = {
  active: "Actif",
  suspended: "Suspendu",
};

export default function AdminStatusBadge({ status }) {
  return <Badge tone={TONE_MAP[status] || "slate"}>{LABEL_MAP[status] || status}</Badge>;
}
