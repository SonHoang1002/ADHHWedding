import { FC, ReactElement } from "react";

import "./invites/invites.css";
import WeddingInvite from "./onboarding/WeddingInvite";

const App: FC = (): ReactElement => {
  // const [kind, setKind] = useState<InviteKind | null>(null);

  // if (kind === "env") return <EnvelopeInvite onBack={() => setKind(null)} />;
  // if (kind === "min") return <MinimalInvite onBack={() => setKind(null)} />;
  // if (kind === "floral") return <FloralInvite onBack={() => setKind(null)} />;
  // if (kind === "pink") return <PinkInvite onBack={() => setKind(null)} />;

  // return <InviteHome onSelect={setKind} />;


 return <WeddingInvite 
 /> 
};

export default App;
