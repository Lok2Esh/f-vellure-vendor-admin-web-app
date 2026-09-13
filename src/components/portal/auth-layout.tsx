import type { ReactNode } from "react";
import { ShieldCheck, CalendarDays, Store, ArrowUpRight } from "lucide-react";
import { Card, Stack, Row, Heading, Text, Badge, NavLink } from "./ui";

export function AuthLayout({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Stack className="v-login v-auth">
      <Card className="v-auth-story">
        <Stack>
          <NavLink href="/login" className="v-login-brand">
            vellure.
          </NavLink>
          <Badge>THE PARTNER WORKSPACE</Badge>
          <Heading level={1}>More time for the work you love.</Heading>
          <Text>
            One thoughtful workspace for your appointments, your team and your
            next chapter.
          </Text>
          <Stack className="v-auth-benefits">
            <Row>
              <CalendarDays size={20} />
              <Text>A clearer view of every working day</Text>
            </Row>
            <Row>
              <Store size={20} />
              <Text>Your business, beautifully organized</Text>
            </Row>
            <Row>
              <ShieldCheck size={20} />
              <Text>Secure access for you and your team</Text>
            </Row>
          </Stack>
        </Stack>
        <Text className="v-auth-signature">
          Made for beauty. Built for business. <ArrowUpRight size={16} />
        </Text>
      </Card>
      <Card className="v-auth-panel">
        <Stack>
          <Text className="v-eyebrow">WELCOME TO VELLURE</Text>
          <Heading level={1}>{title}</Heading>
          <Text muted>{description}</Text>
          {children}
        </Stack>
      </Card>
    </Stack>
  );
}
