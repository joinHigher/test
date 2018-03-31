export default [{
    path: '/message/type/list',
    name: 'message_center',
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/messageCenter/messageType'));
        });
    },
    name: 'message_center'
},{
    path: '/message/allot/list',
    name: 'messages_sent',
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/messageCenter/messagesSent'));
        });
    },
    name: 'messages_sent'
},{
    path: '/message/msg/list',
    name: 'message_list',
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/messageCenter/messageList'));
        });
    },
    name: 'message_list'
},{
    path: '/message/sys-log/list',
    name: 'soa_log',
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/messageCenter/soaLog'));
        });
    },
    name: 'soa_log'
}];