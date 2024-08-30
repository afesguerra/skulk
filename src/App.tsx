import { AppLayout, } from '@cloudscape-design/components';
import { I18nProvider } from '@cloudscape-design/components/i18n';
import messages from '@cloudscape-design/components/i18n/messages/all.all';
import { applyMode, Mode } from '@cloudscape-design/global-styles';
import '@cloudscape-design/global-styles/index.css';
import { Calculator } from './Calculator';

applyMode(Mode.Dark);

const App = () => <I18nProvider messages={[messages]}>
    <AppLayout
        headerVariant={'high-contrast'}
        toolsHide={true}
        navigationHide={true}
        content={<Calculator/>}
    />
</I18nProvider>;

export default App;
