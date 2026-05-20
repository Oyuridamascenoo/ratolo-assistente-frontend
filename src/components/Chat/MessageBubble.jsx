import { nowStamp } from '../../utils/chat.js';
import styles from './Chat.module.css';

function BotContent({ reply }) {
  if (reply.type === 'list') {
    return (
      <>
        {reply.intro && <span>{reply.intro}</span>}
        <div className={styles.kbdList}>
          {reply.items.map((item, i) => (
            <div key={i} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </div>
        {reply.outro && <span style={{ marginTop: 8, display: 'block' }}>{reply.outro}</span>}
      </>
    );
  }
  return <span dangerouslySetInnerHTML={{ __html: reply.text }} />;
}

export function BotMessage({ reply, isTyping }) {
  return (
    <div className={`${styles.msgWrap} ${styles.bot}`}>
      <div className={`${styles.msgAv} ${styles.botAv}`}>AT</div>
      <div className={styles.msgContent}>
        <div className={styles.msgMeta}>
          <span className={styles.name}>Assistente</span>
          <span>{nowStamp()}</span>
        </div>
        <div className={`${styles.bubble} ${styles.bubbleBot}`}>
          {isTyping ? (
            <div className={styles.typingDots}>
              <span /><span /><span />
            </div>
          ) : (
            <BotContent reply={reply} />
          )}
        </div>
      </div>
    </div>
  );
}

export function UserMessage({ text }) {
  return (
    <div className={`${styles.msgWrap} ${styles.user}`}>
      <div className={`${styles.msgAv} ${styles.userAv}`}>VC</div>
      <div className={`${styles.msgContent} ${styles.msgContentUser}`}>
        <div className={styles.msgMeta}>
          <span>{nowStamp()}</span>
          <span className={styles.name}>você</span>
        </div>
        <div className={`${styles.bubble} ${styles.bubbleUser}`}>{text}</div>
      </div>
    </div>
  );
}
