import { Stack } from 'expo-router';

import { Screen } from '@/components/Screen';
import { PageHeader } from '@/components/ui/PageHeader';
import { PrivacyPolicyContent } from '@/components/legal/PrivacyPolicyContent';

export default function PrivacyPolicyScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Gizlilik Politikası', headerShown: false }} />
      <Screen scroll>
        <PageHeader title="Gizlilik Politikası" subtitle="OnBoard Health" />
        <PrivacyPolicyContent />
      </Screen>
    </>
  );
}
