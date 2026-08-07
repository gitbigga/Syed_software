import type {Metadata} from "next";import "./globals.css";
export const metadata:Metadata={title:"Syed Software | Software for Local Business",description:"Websites, automation and custom software built for local businesses.",other:{"codex-preview":"development"}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
