import Messages from '../components/user/Messages';
import SnowLayer from '../components/snow-layer';
import { useTheme } from '../context/theme-context';

const MessageView = () => {
  const { theme } = useTheme();
  
  return (
    <div className="min-h-screen glass">
      {/* Background avec Blobs et Neige intégrée */}
      <div className="fixed inset-0 overflow-hidden -z-20 pointer-events-none">
        {/* Les cercles de couleurs (Blobs) */}
        <div className="absolute rounded-full top-80 left-2/5 -translate-x-1/2 size-130 bg-[#D10A8A] blur-[100px]" />
        <div className="absolute rounded-full top-80 right-0 -translate-x-1/2 size-130 bg-[#2E08CF] blur-[100px]" />
        <div className="absolute rounded-full top-0 left-1/2 -translate-x-1/2 size-130 bg-[#F26A06] blur-[100px]" />
        
        {/* La couche de neige par-dessus les blobs mais sous le texte */}
        <SnowLayer />
      </div>
      <Messages />
    </div>
  );
};

export default MessageView;
