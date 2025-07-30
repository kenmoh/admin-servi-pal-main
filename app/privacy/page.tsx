"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";

const sections = [
  { id: "interpretation", title: "Interpretation & Definitions" },
  { id: "collecting", title: "Collecting & Using Data" },
  { id: "usage", title: "Use of Your Data" },
  { id: "retention", title: "Retention of Your Data" },
  { id: "transfer", title: "Transfer of Your Data" },
  { id: "delete", title: "Delete Your Data" },
  { id: "disclosure", title: "Disclosure of Your Data" },
  { id: "security", title: "Security of Your Data" },
  { id: "children", title: "Children's Privacy" },
  { id: "links", title: "Links to Other Websites" },
  { id: "changes", title: "Changes to this Policy" },
  { id: "contact", title: "Contact Us" },
];

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState("interpretation");
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150; // Offset for header
      let currentSectionId = sections[0].id;

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element && element.offsetTop <= scrollPosition) {
          currentSectionId = section.id;
        }
      }
      setActiveSection(currentSectionId);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Run on initial load
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const SidebarContent = () => (
    <div className="sticky top-20">
      <h3 className="text-lg font-semibold mb-4">Sections</h3>
      <ul className="space-y-2">
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className={`block px-3 py-2 rounded-md text-sm font-medium ${
                activeSection === section.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
              onClick={() => {
                setIsSheetOpen(false)
                setTimeout(() => {
                  const element = document.getElementById(section.id);
                  if (element) {
                    window.scrollTo({
                      top: element.offsetTop - 100, // Adjust for sticky header
                      behavior: 'smooth',
                    });
                  }
                }, 0);
              }}
            >
              {section.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );

  const ListItem = ({ children }) => (
    <li className="flex items-start">
      <CheckCircle className="text-primary w-5 h-5 mr-3 mt-1 flex-shrink-0" />
      <div>{children}</div>
    </li>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="bg-card text-card-foreground">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="md:hidden">
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SidebarContent />
                </SheetContent>
              </Sheet>
            </div>
            <CardTitle className="text-3xl font-bold text-center flex-grow">Privacy Policy</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="grid gap-8 md:grid-cols-12">
          <aside className="hidden md:block md:col-span-3">
            <SidebarContent />
          </aside>
          <main className="col-span-12 md:col-span-9">
            <p className="text-muted-foreground mb-6">Last updated: July 30, 2025</p>
            <p className="mb-6">
              This Privacy Policy describes Our policies and procedures on the
              collection, use and disclosure of Your information when You use the
              Service and tells You about Your privacy rights and how the law protects
              You.
            </p>
            <p className="mb-6">
              We use Your Personal data to provide and improve the Service. By using
              the Service, You agree to the collection and use of information in
              accordance with this Privacy Policy.
            </p>

            <section id="interpretation" className="mb-8 pt-16 -mt-16">
              <h2 className="text-2xl font-bold mb-4 border-b pb-2">Interpretation and Definitions</h2>
              <h3 className="text-xl font-semibold mb-3">Interpretation</h3>
              <p className="mb-4">
                The words of which the initial letter is capitalized have meanings
                defined under the following conditions. The following definitions shall
                have the same meaning regardless of whether they appear in singular or in
                plural.
              </p>
              <h3 className="text-xl font-semibold mb-3">Definitions</h3>
              <p className="mb-4">For the purposes of this Privacy Policy:</p>
              <ul className="space-y-4">
                <ListItem>
                  <p><strong>Account</strong> means a unique account created for You to access our Service or parts of our Service.</p>
                </ListItem>
                <ListItem>
                  <p><strong>Affiliate</strong> means an entity that controls, is controlled by or is under common control with a party, where "control" means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority.</p>
                </ListItem>
                <ListItem>
                  <p><strong>Application</strong> refers to ServiPal, the software program provided by the Company.</p>
                </ListItem>
                <ListItem>
                  <p><strong>Company</strong> (referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to MohStack Ltd, Lagos, Nigeria.</p>
                </ListItem>
                <ListItem>
                  <p><strong>Cookies</strong> are small files that are placed on Your computer, mobile device or any other device by a website, containing the details of Your browsing history on that website among its many uses.</p>
                </ListItem>
                <ListItem>
                  <p><strong>Country</strong> refers to: Nigeria</p>
                </ListItem>
                <ListItem>
                  <p><strong>Device</strong> means any device that can access the Service such as a computer, a cellphone or a digital tablet.</p>
                </ListItem>
                <ListItem>
                  <p><strong>Personal Data</strong> is any information that relates to an identified or identifiable individual.</p>
                </ListItem>
                <ListItem>
                  <p><strong>Service</strong> refers to the Application or the Website or both.</p>
                </ListItem>
                <ListItem>
                  <p><strong>Service Provider</strong> means any natural or legal person who processes the data on behalf of the Company. It refers to third-party companies or individuals employed by the Company to facilitate the Service, to provide the Service on behalf of the Company, to perform services related to the Service or to assist the Company in analyzing how the Service is used.</p>
                </ListItem>
                <ListItem>
                  <p><strong>Usage Data</strong> refers to data collected automatically, either generated by the use of the Service or from the Service infrastructure itself (for example, the duration of a page visit).</p>
                </ListItem>
                <ListItem>
                  <p><strong>Website</strong> refers to ServiPal, accessible from <a href="https://www.servi-pal.com/" rel="external nofollow noopener" target="_blank" className="text-primary hover:underline">https://www.servi-pal.com/</a></p>
                </ListItem>
                <ListItem>
                  <p><strong>You</strong> means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.</p>
                </ListItem>
              </ul>
            </section>

            <section id="collecting" className="mb-8 pt-16 -mt-16">
              <h2 className="text-2xl font-bold mb-4 border-b pb-2">Collecting and Using Your Personal Data</h2>
              <h3 className="text-xl font-semibold mb-3">Types of Data Collected</h3>
              <h4 className="text-lg font-semibold mb-2">Personal Data</h4>
              <p className="mb-4">While using Our Service, We may ask You to provide Us with certain personally identifiable information that can be used to contact or identify You. Personally identifiable information may include, but is not limited to:</p>
              <ul className="space-y-4">
                <ListItem><p>Email address</p></ListItem>
                <ListItem><p>First name and last name</p></ListItem>
                <ListItem><p>Phone number</p></ListItem>
                <ListItem><p>Address, State, Province, ZIP/Postal code, City</p></ListItem>
                <ListItem><p>Usage Data</p></ListItem>
              </ul>
              <h4 className="text-lg font-semibold mb-2 mt-4">Usage Data</h4>
              <p className="mb-4">Usage Data is collected automatically when using the Service.</p>
              <p className="mb-4">Usage Data may include information such as Your Device's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that You visit, the time and date of Your visit, the time spent on those pages, unique device identifiers and other diagnostic data.</p>
              <p className="mb-4">When You access the Service by or through a mobile device, We may collect certain information automatically, including, but not limited to, the type of mobile device You use, Your mobile device unique ID, the IP address of Your mobile device, Your mobile operating system, the type of mobile Internet browser You use, unique device identifiers and other diagnostic data.</p>
              <p className="mb-4">We may also collect information that Your browser sends whenever You visit our Service or when You access the Service by or through a mobile device.</p>
              <h4 className="text-lg font-semibold mb-2 mt-4">Information Collected while Using the Application</h4>
              <p className="mb-4">While using Our Application, in order to provide features of Our Application, We may collect, with Your prior permission:</p>
              <ul className="space-y-4">
                <ListItem><p>Information regarding your location</p></ListItem>
                <ListItem><p>Pictures and other information from your Device's camera and photo library</p></ListItem>
              </ul>
              <p className="mb-4">We use this information to provide features of Our Service, to improve and customize Our Service. The information may be uploaded to the Company's servers and/or a Service Provider's server or it may be simply stored on Your device.</p>
              <p className="mb-4">You can enable or disable access to this information at any time, through Your Device settings.</p>
              <h4 className="text-lg font-semibold mb-2 mt-4">Tracking Technologies and Cookies</h4>
              <p className="mb-4">We use Cookies and similar tracking technologies to track the activity on Our Service and store certain information. Tracking technologies used are beacons, tags, and scripts to collect and track information and to improve and analyze Our Service. The technologies We use may include:</p>
              <ul className="space-y-4">
                <ListItem><strong>Cookies or Browser Cookies.</strong> A cookie is a small file placed on Your Device. You can instruct Your browser to refuse all Cookies or to indicate when a Cookie is being sent. However, if You do not accept Cookies, You may not be able to use some parts of our Service. Unless you have adjusted Your browser setting so that it will refuse Cookies, our Service may use Cookies.</ListItem>
                <ListItem><strong>Web Beacons.</strong> Certain sections of our Service and our emails may contain small electronic files known as web beacons (also referred to as clear gifs, pixel tags, and single-pixel gifs) that permit the Company, for example, to count users who have visited those pages or opened an email and for other related website statistics (for example, recording the popularity of a certain section and verifying system and server integrity).</ListItem>
              </ul>
            </section>

            <section id="usage" className="mb-8 pt-16 -mt-16">
                <h2 className="text-2xl font-bold mb-4 border-b pb-2">Use of Your Personal Data</h2>
                <p className="mb-4">The Company may use Personal Data for the following purposes:</p>
                <ul className="space-y-4">
                    <ListItem><p><strong>To provide and maintain our Service</strong>, including to monitor the usage of our Service.</p></ListItem>
                    <ListItem><p><strong>To manage Your Account:</strong> to manage Your registration as a user of the Service. The Personal Data You provide can give You access to different functionalities of the Service that are available to You as a registered user.</p></ListItem>
                    <ListItem><p><strong>For the performance of a contract:</strong> the development, compliance and undertaking of the purchase contract for the products, items or services You have purchased or of any other contract with Us through the Service.</p></ListItem>
                    <ListItem><p><strong>To contact You:</strong> To contact You by email, telephone calls, SMS, or other equivalent forms of electronic communication, such as a mobile application's push notifications regarding updates or informative communications related to the functionalities, products or contracted services, including the security updates, when necessary or reasonable for their implementation.</p></ListItem>
                    <ListItem><p><strong>To provide You</strong> with news, special offers and general information about other goods, services and events which we offer that are similar to those that you have already purchased or enquired about unless You have opted not to receive such information.</p></ListItem>
                    <ListItem><p><strong>To manage Your requests:</strong> To attend and manage Your requests to Us.</p></ListItem>
                    <ListItem><p><strong>For business transfers:</strong> We may use Your information to evaluate or conduct a merger, divestiture, restructuring, reorganization, dissolution, or other sale or transfer of some or all of Our assets, whether as a going concern or as part of bankruptcy, liquidation, or similar proceeding, in which Personal Data held by Us about our Service users is among the assets transferred.</p></ListItem>
                    <ListItem><p><strong>For other purposes</strong>: We may use Your information for other purposes, such as data analysis, identifying usage trends, determining the effectiveness of our promotional campaigns and to evaluate and improve our Service, products, services, marketing and your experience.</p></ListItem>
                </ul>
            </section>

            <section id="retention" className="mb-8 pt-16 -mt-16">
                <h2 className="text-2xl font-bold mb-4 border-b pb-2">Retention of Your Personal Data</h2>
                <p className="mb-4">The Company will retain Your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use Your Personal Data to the extent necessary to comply with our legal obligations (for example, if we are required to retain your data to comply with applicable laws), resolve disputes, and enforce our legal agreements and policies.</p>
                <p className="mb-4">The Company will also retain Usage Data for internal analysis purposes. Usage Data is generally retained for a shorter period of time, except when this data is used to strengthen the security or to improve the functionality of Our Service, or We are legally obligated to retain this data for longer time periods.</p>
            </section>

            <section id="transfer" className="mb-8 pt-16 -mt-16">
                <h2 className="text-2xl font-bold mb-4 border-b pb-2">Transfer of Your Personal Data</h2>
                <p className="mb-4">Your information, including Personal Data, is processed at the Company's operating offices and in any other places where the parties involved in the processing are located. It means that this information may be transferred to — and maintained on — computers located outside of Your state, province, country or other governmental jurisdiction where the data protection laws may differ than those from Your jurisdiction.</p>
                <p className="mb-4">Your consent to this Privacy Policy followed by Your submission of such information represents Your agreement to that transfer.</p>
                <p className="mb-4">The Company will take all steps reasonably necessary to ensure that Your data is treated securely and in accordance with this Privacy Policy and no transfer of Your Personal Data will take place to an organization or a country unless there are adequate controls in place including the security of Your data and other personal information.</p>
            </section>

            <section id="delete" className="mb-8 pt-16 -mt-16">
                <h2 className="text-2xl font-bold mb-4 border-b pb-2">Delete Your Personal Data</h2>
                <p className="mb-4">You have the right to delete or request that We assist in deleting the Personal Data that We have collected about You.</p>
                <p className="mb-4">Our Service may give You the ability to delete certain information about You from within the Service.</p>
                <p className="mb-4">You may update, amend, or delete Your information at any time by signing in to Your Account, if you have one, and visiting the account settings section that allows you to manage Your personal information. You may also contact Us to request access to, correct, or delete any personal information that You have provided to Us.</p>
                <p className="mb-4">Please note, however, that We may need to retain certain information when we have a legal obligation or lawful basis to do so.</p>
            </section>

            <section id="disclosure" className="mb-8 pt-16 -mt-16">
                <h2 className="text-2xl font-bold mb-4 border-b pb-2">Disclosure of Your Personal Data</h2>
                <h3 className="text-xl font-semibold mb-3">Business Transactions</h3>
                <p className="mb-4">If the Company is involved in a merger, acquisition or asset sale, Your Personal Data may be transferred. We will provide notice before Your Personal Data is transferred and becomes subject to a different Privacy Policy.</p>
                <h3 className="text-xl font-semibold mb-3">Law enforcement</h3>
                <p className="mb-4">Under certain circumstances, the Company may be required to disclose Your Personal Data if required to do so by law or in response to valid requests by public authorities (e.g. a court or a government agency).</p>
                <h3 className="text-xl font-semibold mb-3">Other legal requirements</h3>
                <p className="mb-4">The Company may disclose Your Personal Data in the good faith belief that such action is necessary to:</p>
                <ul className="space-y-4">
                    <ListItem>Comply with a legal obligation</ListItem>
                    <ListItem>Protect and defend the rights or property of the Company</ListItem>
                    <ListItem>Prevent or investigate possible wrongdoing in connection with the Service</ListItem>
                    <ListItem>Protect the personal safety of Users of the Service or the public</ListItem>
                    <ListItem>Protect against legal liability</ListItem>
                </ul>
            </section>

            <section id="security" className="mb-8 pt-16 -mt-16">
              <h2 className="text-2xl font-bold mb-4 border-b pb-2">Security of Your Personal Data</h2>
              <p className="mb-4">
                The security of Your Personal Data is important to Us, but remember that
                no method of transmission over the Internet, or method of electronic
                storage is 100% secure. While We strive to use commercially acceptable
                means to protect Your Personal Data, We cannot guarantee its absolute
                security.
              </p>
            </section>

            <section id="children" className="mb-8 pt-16 -mt-16">
                <h2 className="text-2xl font-bold mb-4 border-b pb-2">Children's Privacy</h2>
                <p className="mb-4">Our Service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from anyone under the age of 13. If You are a parent or guardian and You are aware that Your child has provided Us with Personal Data, please contact Us. If We become aware that We have collected Personal Data from anyone under the age of 13 without verification of parental consent, We take steps to remove that information from Our servers.</p>
                <p className="mb-4">If We need to rely on consent as a legal basis for processing Your information and Your country requires consent from a parent, We may require Your parent's consent before We collect and use that information.</p>
            </section>

            <section id="links" className="mb-8 pt-16 -mt-16">
                <h2 className="text-2xl font-bold mb-4 border-b pb-2">Links to Other Websites</h2>
                <p className="mb-4">Our Service may contain links to other websites that are not operated by Us. If You click on a third party link, You will be directed to that third party's site. We strongly advise You to review the Privacy Policy of every site You visit.</p>
                <p className="mb-4">We have no control over and assume no responsibility for the content, privacy policies or practices of any third party sites or services.</p>
            </section>

            <section id="changes" className="mb-8 pt-16 -mt-16">
                <h2 className="text-2xl font-bold mb-4 border-b pb-2">Changes to this Privacy Policy</h2>
                <p className="mb-4">We may update Our Privacy Policy from time to time. We will notify You of any changes by posting the new Privacy Policy on this page.</p>
                <p className="mb-4">We will let You know via email and/or a prominent notice on Our Service, prior to the change becoming effective and update the "Last updated" date at the top of this Privacy Policy.</p>
                <p className="mb-4">You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</p>
            </section>

            <section id="contact" className="mb-8 pt-16 -mt-16">
              <h2 className="text-2xl font-bold mb-4 border-b pb-2">Contact Us</h2>
              <p className="mb-4">
                If you have any questions about this Privacy Policy, You can contact us:
              </p>
              <ul className="space-y-4">
                <ListItem>
                  <p>By email: <a href="mailto:servipal@servi-pal.com" className="text-primary hover:underline">servipal@servi-pal.com</a></p>
                </ListItem>
                <ListItem>
                  <p>
                    By visiting this page on our website:
                    <a
                      href="https://www.servi-pal.com/"
                      rel="external nofollow noopener"
                      target="_blank"
                      className="text-primary hover:underline ml-1"
                    >
                      https://www.servi-pal.com/
                    </a>
                  </p>
                </ListItem>
              </ul>
            </section>
          </main>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyPolicy;
