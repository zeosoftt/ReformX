import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Redirect } from 'expo-router';

import { Screen } from '@/components/Screen';
import { AppText } from '@/components/ui/AppText';
import { useAppColors } from '@/hooks/useAppColors';
import { hasCompletedOnboarding } from '@/services/onboardingStorage';

export default function Index() {
  const c = useAppColors();
  const [ready, setReady] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    let cancelled = false;
    hasCompletedOnboarding().then((done) => {
      if (!cancelled) {
        setCompleted(done);
        setReady(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) {
    return (
      <Screen>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={c.primary} size="large" />
          <AppText variant="muted" style={{ marginTop: 12 }}>
            Yükleniyor…
          </AppText>
        </View>
      </Screen>
    );
  }

  return <Redirect href={completed ? '/(tabs)' : '/onboarding'} />;
}
