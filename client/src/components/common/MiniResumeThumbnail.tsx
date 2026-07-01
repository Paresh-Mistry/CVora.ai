import LayoutStack from '../../templates/LayoutStack';
import LayoutSidebar from '../../templates/LayoutSidebar';
import LayoutBanner from '../../templates/LayoutBanner';
import {DefaultData} from '../../data.json'
import { TemplateOut } from '../../services/ai.services';

const MiniResumeThumbnail = ({tmpl, scale=0.28}:{tmpl:TemplateOut, scale:number}) => {
const Layout = tmpl?.layout === "A" ? LayoutStack : tmpl?.layout === "B" ? LayoutSidebar : LayoutBanner;
  return (
    <div style={{ width: `${210 * scale}mm`, height: `${148 * scale}mm`, overflow: "hidden", pointerEvents: "none", borderRadius: "3px" }}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: "top left", width: `${1/scale * 100}%`, height: `${1/scale * 100}%` }}>
        <div style={{ width: "210mm", minHeight: "297mm" }}>
          <Layout d={DefaultData as any} tk={tmpl?.tokens} />
        </div>
      </div>
    </div>
  );
}

export default MiniResumeThumbnail
