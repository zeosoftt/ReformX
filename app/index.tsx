import { Redirect } from 'expo-router';

/**
 * Şimdilik her açılışta onboarding ile başlar (geliştirme / demo).
 * Kalıcı “tamamlandıysa sekmelere” davranışı için hasCompletedOnboarding kontrolünü geri ekleyin.
 */
export default function Index() {
  return <Redirect href="/onboarding" />;
}
