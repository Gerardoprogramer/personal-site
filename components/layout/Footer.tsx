import { FooterBrand } from "./footer/FooterBrand"
import { FooterNav } from "./footer/FooterNav"
import { FooterContact } from "./footer/FooterContact"
import { FooterBottomBar } from "./footer/FooterBottomBar"

export const Footer = () => {

  return (
    <footer className="border-t border-border bg-surface/60 py-14">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <FooterBrand />
          <FooterNav />
          <FooterContact />
        </div>
        <FooterBottomBar />
      </div>
    </footer>
  )
}
