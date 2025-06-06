

export const getStatus = (item, system, code) => {
  if (item) {
    const isFirewall = system === 'Firewall request';
    // Check if actionLine contains 'rejected'
    const isAnyRejected = Array.isArray(item.actionLine) &&
      item.actionLine.some(a => a.action === 'rejected');
    // Check if all actionLine items are 'approved'
    const isAllApproved = Array.isArray(item.actionLine) &&
      item.actionLine.length > 0 &&
      item.actionLine.every(a => a.action === 'approved');
    // Check approverStatus from actionLine
    const actionLineStatus = isFirewall
      ? item.actionLine?.find(a => a.code === localStorage.getItem("userCode") || a.code === code)?.action
      : null;

    const islastActionLine = item.actionLine?.slice(-1)[0];
    const approverStatus = actionLineStatus === 'approved'
      ? 'forwarded, waiting for approval'
      : actionLineStatus === 'wait'
        ? 'waiting for approval'
        : null;

    const status =
      isAnyRejected ? 'rejected' :
        isAllApproved ? 'approved' :
          approverStatus ? approverStatus :
            item.sectionHeadStatus === 'approved' && item.departmentHeadStatus === 'approved' && item.maxLevelApprover === 4 ? 'approved' :
              item.sectionHeadStatus === 'approved' && item.departmentHeadStatus === 'wait' && item.maxLevelApprover === 4 ? 'forwarded, waiting for approval' :
                item.sectionHeadStatus === 'wait' && item.departmentHeadStatus === 'wait' && item.maxLevelApprover === 4 ? 'waiting for approval' :
                  item.sectionHeadStatus === 'reject' && item.departmentHeadStatus === 'wait' && item.maxLevelApprover === 4 ? 'rejected' :
                    item.sectionHeadStatus === 'approved' && item.departmentHeadStatus === 'reject' && item.maxLevelApprover === 4 ? 'rejected' :
                      item.sectionHeadStatus === 'approved' && item.departmentHeadStatus === 'wait' && isFirewall && item.maxLevelApprover === 3 ? 'forwarded, waiting for approval' :
                      
                        item.sectionHeadStatus === 'approved' && item.departmentHeadStatus === 'wait' && item.maxLevelApprover === 3 ? 'approved' :
                          item.sectionHeadStatus === 'wait' && item.departmentHeadStatus === 'wait' && item.maxLevelApprover === 3 ? 'waiting for approval' :
                            item.sectionHeadStatus === 'reject' && item.departmentHeadStatus === 'wait' && item.maxLevelApprover === 3 ? 'rejected' :
                              item.sectionHeadStatus === 'draft' && item.departmentHeadStatus === 'wait' ? 'draft' :
                                'approved';
    return { status, isFirewall, islastActionLine };
  }

}

export const getColorSystem = (item, theme) => {
  const color = item.system ===
    'Digital request' ? theme.palette.warning.main :
    'Firewall request' ? theme.palette.info.light :
      '#000';

  return (
    <b style={{ color }}>
      {item.system}
    </b>
  );
};
