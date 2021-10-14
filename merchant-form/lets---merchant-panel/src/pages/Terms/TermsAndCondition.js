import React from "react";
import letsLogo from "../../assets/images/icon/lets-logo-trans.svg";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    background: "#F4F4F8",
  },
  container: {
    width: "80%",
    margin: "auto",
  },
  header: {
    minHeight: 64,
    backgroundColor: theme.palette.primary.main,
    marginBottom: theme.spacing(5),
    "& img": {
      padding: theme.spacing(2),
      cursor: "pointer",
    },
  },
  wrapper: {
    padding: 60,
    "& .title": {
      display: "flex",
      marginBottom: theme.spacing(4),
      "& h1": {
        fontWeight: "bold",
      },
    },
    "& article": {
      "& section": {
        textAlign: "justify",
        marginBottom: theme.spacing(3),
        "&>p": {
          lineHeight: 1.8,
        },
        "& .sub-content": {
          marginLeft: theme.spacing(3),
          marginTop: theme.spacing(2),
          "&>p": {
            lineHeight: 1.8,
            marginBottom: theme.spacing(3),
          },
        },
      },
    },
    "& a": {
      color: "#000",
    },
  },
}));
const TermsAndCondition = () => {
  const classes = useStyles();
  const goBack = () => {
    window.history.back();
  };
  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <img src={letsLogo} alt="Lets" onClick={goBack} />
      </div>
      <div className="container">
        <Paper className={classes.wrapper}>
          <div className={classes.container}>
            {/* TERMS */}
            <div className="title">
              <Typography variant="h5" component="h1">
                Terms & Conditions
              </Typography>
            </div>
            <article>
              <section>
                <Typography variant="body1">
                  These Terms and Conditions (“Terms”) govern your use of the
                  websites and mobile applications provided by Dearwolves (or
                  referred to as “us”) (collectively the “Platforms”). Please
                  read these Terms carefully. By accessing and using the
                  Platforms, you agree that you have read, understood and
                  accepted the Terms including any additional terms and
                  conditions and any policies referenced herein, available on
                  the Platforms or available by hyperlink. If you do not agree
                  or fall within the Terms, please do not use the Platforms.
                </Typography>
              </section>
              <section>
                <Typography variant="body1">
                  The Platforms may be used by (i) natural persons who have
                  reached 18 years of age and (ii) corporate legal entities, e.g
                  companies. Where applicable, these Terms shall be subject to
                  country-specific provisions as set out herein.
                </Typography>
              </section>
              <section>
                <Typography variant="body1">
                  Users below the age of 18 must obtain consent from parent(s)
                  or legal guardian(s), who by accepting these Terms shall agree
                  to take responsibility for your actions and any charges
                  associated with your use of the Platforms and/or purchase of
                  Goods. If you do not have consent from your parent(s) or legal
                  guardian(s), you must stop using/accessing the Platforms
                  immediately.
                </Typography>
              </section>
              <section>
                <Typography variant="body1">
                  Dearwolves reserves the right to change or modify these Terms
                  (including our policies which are incorporated into these
                  Terms) at any time. You are strongly recommended to read these
                  Terms regularly. You will be deemed to have agreed to the
                  amended Terms by your continued use of the Platforms following
                  the date on which the amended Terms are posted.
                </Typography>
              </section>
            </article>
            {/* 1.0 */}
            <div className="title">
              <Typography variant="h5" component="h1">
                1. LETS
              </Typography>
            </div>
            <article>
              <section>
                <Typography variant="body1">
                  1.1 Who we are Depending on which Platform you access and use,
                  these Terms form the contract between you and the following
                  LETS entity (
                  <a href="https://lets.com.ph/" target="_blank" rel="noopener noreferrer">
                    https://lets.com.ph/
                  </a>
                  ).
                </Typography>
              </section>
              <section>
                <Typography variant="body1">
                  1.2 What we do Through our Platforms, LETS links you to the
                  vendors (“Vendors”) for you to order a variety of goods
                  including prepared meals, non-prepared food and miscellaneous
                  non-food items (hereinafter collectively referred to as
                  "Goods") to be delivered to you. When you place an order for
                  Goods from our Vendors (“Order”), LETS acts as an agent on
                  behalf of that Vendor to facilitate, process and conclude the
                  order and subsequently for either us or the Vendor to deliver
                  your Order to you. Vendors may be owned and operated by third
                  party vendors, our affiliate companies, or us.
                </Typography>
              </section>
            </article>
            {/* 2.0 */}
            <div className="title">
              <Typography variant="h5" component="h1">
                2. Use of the Platforms and LETS Account
              </Typography>
            </div>
            <article>
              <section>
                <Typography variant="body1">
                  2.1 You will need to register for a LETS account for you to
                  use the Platform. When you register for a LETS account we will
                  ask you to provide your personal information including a valid
                  email address and a mobile phone number.
                </Typography>
              </section>
              <section>
                <Typography variant="body1">
                  2.2 LETS shall not be liable for Orders that encounter
                  delivery issues due to incomplete, incorrect or missing
                  information provided by you. You are obliged to provide
                  information that is complete, accurate and truthful for the
                  proper processing of the Order, including your delivery
                  address and contact information.
                </Typography>
              </section>
              <section>
                <Typography variant="body2">
                  2.3 If you wish to delete your LETS account, please send us an
                  email requesting the same. We may restrict, suspend or
                  terminate your LETS account and/or use of the Platforms, if we
                  reasonably believe that:
                </Typography>
                <div className="sub-content">
                  <Typography variant="body2">
                    2.3.1 someone other than you is using your LETS account; or
                  </Typography>
                  <Typography variant="body2">
                    2.3.2 where you are suspected or discovered to have been
                    involved in any activity or conduct that is in breach of
                    these Terms, our policies and guidelines, or involved in
                    activity or conduct which we deem in our sole discretion to
                    be an abuse of the Platforms.
                  </Typography>
                </div>
              </section>
            </article>
            {/* 3.0 */}
            <div className="title">
              <Typography variant="h5" component="h1">
                3. Restrictions
              </Typography>
            </div>
            <article>
              <section>
                <Typography variant="body1">
                  3.1 Activities Prohibited on the Platforms
                </Typography>
                <Typography variant="body1">
                  The following is a non-exhaustive list of the types of conduct
                  that are illegal or prohibited on the Platforms. LETS reserves
                  the right to investigate and take appropriate legal action
                  against anyone who, in LETS's sole discretion, engages in any
                  of the prohibited activities. Prohibited activities include,
                  but are not limited to the following:
                </Typography>
                <div className="sub-content">
                  <Typography variant="body2">
                    3.1.1 using the Platforms for any purpose in violation of
                    local, state, or federal laws or regulations;
                  </Typography>
                  <Typography variant="body2">
                    3.1.2 posting any content that infringes the intellectual
                    property rights, privacy rights, publicity rights, trade
                    secret rights, or any other rights of any party;
                  </Typography>
                  <Typography variant="body2">
                    3.1.3 posting content that is unlawful, obscene, defamatory,
                    threatening, harassing, abusive, slanderous, hateful, or
                    embarrassing to any other person or entity as determined by
                    LETS in its sole discretion or pursuant to local community
                    standards;
                  </Typography>
                  <Typography variant="body2">
                    3.1.4 posting content that constitutes cyber-bullying, as
                    determined by LETS in its sole discretion;
                  </Typography>
                  <Typography variant="body2">
                    3.1.5 posting content that depicts any dangerous,
                    life-threatening, or otherwise risky behavior;
                  </Typography>
                  <Typography variant="body2">
                    3.1.6 posting telephone numbers, street addresses, or last
                    names of any person;
                  </Typography>
                  <Typography variant="body2">
                    3.1.7 posting URLs to external websites or any form of HTML
                    or programming code;
                  </Typography>
                  <Typography variant="body2">
                    3.1.8 posting anything that may be “spam,” as determined by
                    LETS in its sole discretion;
                  </Typography>
                  <Typography variant="body2">
                    3.1.9 impersonating another person when posting content;
                  </Typography>
                  <Typography variant="body2">
                    3.1.10 harvesting or otherwise collecting information about
                    others, including e-mail addresses, without their consent;
                  </Typography>
                  <Typography variant="body2">
                    3.1.11 allowing any other person or entity to use your
                    identification for posting or viewing comments;
                  </Typography>
                  <Typography variant="body2">
                    3.1.12 harassing, threatening, stalking, or abusing any
                    person on the Platforms;
                  </Typography>
                  <Typography variant="body2">
                    3.1.13 engaging in any other conduct that restricts or
                    inhibits any other person from using or enjoying the
                    Websites, or which, in the sole discretion of lets, exposes
                    lets or any of its customers, suppliers, or any other
                    parties to any liability or detriment of any type; or
                  </Typography>
                  <Typography variant="body2">
                    3.1.14 encouraging other people to engage in any prohibited
                    activities as described herein.
                  </Typography>
                </div>
              </section>
              <section>
                <Typography variant="body1">
                  3.2 LETS reserves the right but is not obligated to do any or
                  all of the following:
                </Typography>
                <div className="sub-content">
                  <Typography variant="body1">
                    3.2.1 investigate an allegation that any content posted on
                    the Platforms does not conform to these Terms and determine
                    in its sole discretion to remove or request the removal of
                    the content;
                  </Typography>
                  <Typography variant="body1">
                    3.2.2 remove content which is abusive, illegal, or
                    disruptive, or that otherwise fails to conform with these
                    Terms;
                  </Typography>
                  <Typography variant="body1">
                    3.2.3 suspend or terminate a user’s access to the Platforms
                    or their LETS Account upon any breach of these Terms;
                  </Typography>
                  <Typography variant="body1">
                    3.2.4 monitor, edit, or disclose any content on the
                    Platforms; and
                  </Typography>
                  <Typography variant="body1">
                    3.2.5 edit or delete any content posted on the Platforms,
                    regardless of whether such content violates these standards.
                  </Typography>
                </div>
              </section>
            </article>
            {/* 4.0 */}
            <div className="title">
              <Typography variant="h5" component="h1">
                4. Intellectual Property
              </Typography>
            </div>
            <article>
              <section>
                You’re not allowed to copy, or modify the app, any part of the
                app, or our trademarks in any way. You’re not allowed to attempt
                to extract the source code of the app, and you also shouldn’t
                try to translate the app into other languages, or make
                derivative versions. The app itself, and all the trade marks,
                copyright, database rights and other intellectual property
                rights related to it, still belong to Dearwolves.
              </section>
            </article>
            {/* 5.0 */}
            <div className="title">
              <Typography variant="h5" component="h1">
                5. Ordering
              </Typography>
            </div>
            <article>
              <section>
                We in our sole discretion, choose to not process or to cancel
                your orders in certain circumstances. This may occur, for
                example, when the meals or products you wish to order are no
                longer available, out of coverage for delivery, or in other
                unforeseen circumstances such as operational outages. We will
                not charge you in these cases or refund the charges for orders
                that we do not process or cancel.
              </section>
            </article>
            {/* 6.0 */}
            <div className="title">
              <Typography variant="h5" component="h1">
                6. Prices and Payments
              </Typography>
            </div>
            <article>
              <section>
                All prices are in Philippine Peso, unless otherwise stated. The
                prices are correct as shown on the Platforms, and are inclusive
                of applicable tax and delivery charges unless the delivery
                address is not within the delivery area or minimum order/basket
                size requirement shall apply. We reserve the right to review the
                prices from time to time. Payment can be made online.
              </section>
              <section>
                We may operate dynamic pricing some of the time, which means
                that prices of Items and delivery may change while you are
                browsing. Prices can also change at any time at our discretion
                of the Partner Restaurants. We reserve the right to charge a
                Service Fee, which may be subject to change, for the provision
                of our Services. You will be notified of any applicable Service
                Fee and taxes prior to purchase on the checkout page on our
                Application. No changes will affect existing confirmed orders,
                unless there is an obvious pricing mistake. Nor will changes to
                prices affect any orders in process and appearing within your
                basket.
              </section>
              <section>
                Orders are considered final as soon as they are paid and
                modification/cancellation is generally not permitted. We are not
                liable or responsible for the time of an outside delay in the
                outside payment gateway to charge or refund you or if your bank
                account/credit card has been used in a fraudulent manner.
              </section>
            </article>
            {/* 7.0 */}
            <div className="title">
              <Typography variant="h5" component="h1">
                7. Vendor Delivery
              </Typography>
            </div>
            <article>
              <section>
                In some cases, our Vendors will deliver the Order to you
                (“Vendor Delivery”). While we will use reasonable efforts to
                provide prior notice to you on Vendor Delivery, this may not
                always be possible. Where Vendor Delivery applies, we may ask
                you to contact the Vendor directly in the event of issues or
                delays in your delivery. Lets shall not be responsible in any
                way for Orders or Goods that are delivered by Vendors.
              </section>
            </article>
            {/* 8.0 */}
            <div className="title">
              <Typography variant="h5" component="h1">
                8. Vouchers, Discounts and Promotions
              </Typography>
            </div>
            <article>
              <section>
                8.1 From time to time, LETS may run marketing and promotional
                campaigns which offer voucher codes, discounts, and other
                promotional offers to be used on the Platforms (“Vouchers”).
                Vouchers are subject to validity periods, redemption periods,
                and in certain cases, may only be used once.
              </section>
              <section>
                8.2 Vouchers may not be valid when used in conjunction with
                other promotions, discounts or other vouchers. Additional terms
                and conditions may apply to Vouchers.
              </section>
              <section>
                8.3 Unless otherwise stated, Vouchers can only be used on our
                Platforms.
              </section>
              <section>8.4 Vouchers cannot be exchanged for cash.</section>
              <section>
                8.5 LETS reserves the right to void, discontinue or reject the
                use of any Voucher without prior notice Individual restaurants
                terms & conditions apply
              </section>
              <section>
                8.6 We may exclude certain Vendors from the use of Vouchers at
                any time without prior notice to you.
              </section>
            </article>
            {/* 9.0 */}
            <div className="title">
              <Typography variant="h5" component="h1">
                9. Liability
              </Typography>
            </div>
            <article>
              <section>
                By using our Platforms, you acknowledge and agree that the use
                of the Platforms is at your own risk and the maximum extent
                permitted according to the applicable law, in no circumstances,
                shall we be liable for any direct, indirect, incidental,
                special, consequential, or punitive damages, losses, costs or
                expenses nor for any loss of profit that results from the use
                of, or inability to use the Platforms, or any application or
                material on any site linked to this Platforms (including but not
                limited to any viruses, bugs or any other errors or defects or
                failures in computer transmissions or network communications)
                even if we have been advised of the possibility of such damage.
                In addition, no liability can be accepted by us in respect of
                any changes made to the content of the Platforms by unauthorized
                third parties. All express or implied warranties or
                representations are excluded to the maximum extent permitted
                according to the applicable law.
              </section>
              <section>
                We disclaim any and all liability to you for the supply of the
                delivery and products to the fullest extent permissible under
                applicable laws unless the loss or damage is due to our willful
                misconduct, or gross negligence. This however shall not affect
                your statutory rights as a consumer under applicable laws. In
                the event that we are found liable for any loss or damage, such
                liability is limited to the amount that you have paid for the
                relevant products. We shall not be liable for any consequential,
                indirect or special damage, howsoever arising.
              </section>
              <section>
                In the event of reasonable belief that there exists an abuse of
                promotional event and/or suspects instances of fraud, we may
                cause the suspected user to be blocked immediately and reserves
                the right to refuse future services. Additionally, should there
                exist an abuse of vouchers or discount codes, we reserves the
                right to seek compensation or damages from any and all
                violators. Any promotions or offers are subject to our sole
                discretion and may be withdrawn at any time and without prior
                notice.
              </section>
              <section>
                The Platforms may include content, information or links to third
                parties or third party sites. We shall not be held responsible
                for the content of any such sites or neither for the content of
                any third party advertising or sponsorship nor for compliance of
                such with any regulations. The links may be accessed at your own
                risk and we make no representations or warranties about the
                content, completeness, or accuracy of these links or the sites
                hyperlinked to this Platforms. You agree to hold harmless and
                relieve us from any liability whatsoever arising from your use
                of information from a third party or your use of any third-party
                website.
              </section>
              <section>
                You agree to indemnify, defend and hold us harmless from and
                against all losses, expenses, damages and costs, including
                reasonable attorneys' fees, resulting from any use of the
                Website or the App, or as a result of violation of this Terms
                and Conditions by you or through use of your account.
              </section>
            </article>
            {/* 10.0 */}
            <div className="title">
              <Typography variant="h5" component="h1">
                10. Data Privacy
              </Typography>
            </div>
            <article>
              <section>
                We process your personal data in accordance with our Privacy
                Policy which can be found at our Privacy Policy page.
              </section>
            </article>
            {/* 11.0 */}
            <div className="title">
              <Typography variant="h5" component="h1">
                11. Indemnity
              </Typography>
            </div>
            <article>
              <section>
                You agree to indemnify, defend, hold harmless LETS, its
                directors, officers, employees, representatives, agents, and
                affiliates, from any and all third party claims, liability,
                damages and/or costs (including but not limited to, legal fees)
                arising from your use of the Platforms or your breach of these
                Terms.
              </section>
            </article>
            {/* 12.0 */}
            <div className="title">
              <Typography variant="h5" component="h1">
                12. Third Party Links and Websites
              </Typography>
            </div>
            <article>
              <section>
                he Platforms may contain links to other third party websites and
                by clicking on these links, you agree to do so at your own risk.
                Lets does not control or endorse these third party websites or
                links and shall not be responsible for the content of these
                linked pages. LETS accepts no liability or responsibility for
                any loss or damage which may be suffered by you in relation to
                your access and use of these third party links and websites.
              </section>
            </article>
            {/* 13.0 */}
            <div className="title">
              <Typography variant="h5" component="h1">
                13. Termination of Account
              </Typography>
            </div>
            <article>
              <section>
                LETS has the right to terminate or delete your account and
                access to the Platforms, including any delivery service we
                provide to you in respect of an Order, for any reason,
                including, without limitation, if LETS, in its sole discretion,
                considers your use to be unacceptable, or in the event of any
                breach by you of the Terms. LETS may, but shall be under no
                obligation to, provide you a warning prior to termination of
                your use of the Websites..
              </section>
            </article>
            {/* 14.0 */}
            <div className="title">
              <Typography variant="h5" component="h1">
                14. Variation of Terms and Conditions
              </Typography>
            </div>
            <article>
              <section>
                We may update our Terms and Conditions from time to time. Thus,
                you are advised to review this page periodically for any
                changes. We will notify you of any changes by posting the new
                Terms and Conditions on this page.
              </section>
            </article>
            {/* 15.0 */}
            <div className="title">
              <Typography variant="h5" component="h1">
                15. Governing Laws
              </Typography>
            </div>
            <article>
              <section>
                These terms and conditions are governed by and construed in
                accordance with the laws of the country and you irrevocably
                submit to the exclusive jurisdiction of the courts in that State
                or location.
              </section>
            </article>
            {/* 16.0 */}
            <div className="title">
              <Typography variant="h5" component="h1">
                16. Contact Us
              </Typography>
            </div>
            <article>
              <section>
                If you have any questions or suggestions about our Terms and
                Conditions, do not hesitate to contact us at Website:
                lets.com.ph Email: Contact@lets.com.ph Address: 2342 Peacock
                Street, Fairview, Quezon City.
              </section>
            </article>
          </div>
        </Paper>
      </div>
    </div>
  );
};

export default TermsAndCondition;
