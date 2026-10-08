import { FC, ReactElement, useState } from "react";
import InviteHome, { InviteKind } from "./invites/InviteHome";
import EnvelopeInvite from "./invites/EnvelopeInvite";
import MinimalInvite from "./invites/MinimalInvite";
import FloralInvite from "./invites/FloralInvite";
import PinkInvite from "./invites/PinkInvite";
import "./invites/invites.css";

const App: FC = (): ReactElement => {
  const [kind, setKind] = useState<InviteKind | null>(null);

  if (kind === "env") return <EnvelopeInvite onBack={() => setKind(null)} />;
  if (kind === "min") return <MinimalInvite onBack={() => setKind(null)} />;
  if (kind === "floral") return <FloralInvite onBack={() => setKind(null)} />;
  if (kind === "pink") return <PinkInvite onBack={() => setKind(null)} />;

  return <InviteHome onSelect={setKind} />;
};

export default App;
